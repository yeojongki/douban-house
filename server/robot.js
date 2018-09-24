const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db');
const {
  scheduleJob,
  extractHouse,
  userAgents,
  sleep,
  easyArrDiff,
  write
} = require('./util');

// create random userAgent
const createUserAgent = () => ({
  headers: {
    'User-Agent': userAgents[parseInt(Math.random() * userAgents.length)]
  }
});

// axios.interceptors.request.use(config => {
//   // console.log(config);
//   return config;
// });

// config axios
axios.defaults.timeout = 1000 * 7;

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * @param {any} cycle schedule job cycle detail: https://www.npmjs.com/package/node-schedule
 * @param {Number} maxPage one schedule job fetch max pages
 * @param {Number} maxNum db houses max number
 * @param {Number} delNum if over db houses max number, delete how many numbers
 */
class Robot {
  constructor(
    cycle = { second: 0, minute: 0, hour: 0 },
    maxPage = 10,
    maxNum = 5000,
    delNum = 500
  ) {
    // group list url
    this.groupPrefixUrl =
      'https://www.douban.com/group/gz020/discussion?start=';
    // group topic detail url
    this.topicUrl = 'https://www.douban.com/group/topic/';
    this.page = 0;
    this.waitTime = () => {
      return Math.ceil(Math.random() * 10 * 1000 + Math.random() * 777);
    };
    this.maxPage = maxPage;
    this.maxNum = maxNum;
    this.delNum = delNum;
    this.cycle = cycle;
    // this.cycle = {
    //   second: new Date().getSeconds() + 3,
    //   minute: new Date().getMinutes()
    // };
    this.timer = null;

    this.init();
  }

  // init
  async init() {
    // if need delete
    try {
      await this.handleDelete(this.maxNum, this.delNum);
    } catch (e) {
      console.error(e);
    }

    // everyday at 0:00am
    scheduleJob(this.cycle, () => {
      console.log(`start scheduleJob, time: ${new Date()}`);

      this.page = 0;

      const handleFetchComplete = () => {
        this.page++;
        // if maxPages clear timer
        if (this.page === this.maxPage) {
          this.timer = null;
          return;
        }
        this.timer = setTimeout(fetchAndInsert, this.waitTime());
      };

      const fetchAndInsert = async () => {
        console.log(`start fetchList, current page: ${this.page}`);

        clearTimeout(this.timer);
        // fetch & insert
        let data = await this.fetchList();

        try {
          await this.insertToDB(data);
          handleFetchComplete();
        } catch (e) {
          handleFetchComplete();
        }
      };

      // start
      fetchAndInsert();
    });
  }

  // fetch list
  fetchList() {
    const that = this;
    return new Promise((resolve, reject) => {
      axios
        .get(that.groupPrefixUrl + that.page * 25, createUserAgent())
        // .get(`http://localhost:3003/${that.page}.html`)
        .then(res => {
          resolve(that.handleListData(res));
        })
        .catch(err => {
          console.error('fetch list error');
          reject(err);
        });
    });
  }

  // transform useful list data
  handleListData(html) {
    const result = [];
    const curYear = new Date().getFullYear();
    const $ = cheerio.load(html);
    // const $trs = $('table.olt tr').eq(1);
    const $trs = $('table.olt tr');
    $trs.each(function(i) {
      // if (i >= 0) {
      if (i > 0) {
        let line = {};
        const $tds = $(this).children('td');
        $tds.each(function() {
          let $td = $(this);
          // only need `title` & `time` & `author` td
          const isTitleTd = $td.hasClass('title');
          const isTimeTd = $td.hasClass('time');
          const isAuthorTd = $td.index() == 1;
          if (isTitleTd || isAuthorTd || isTimeTd) {
            // title & url
            if (isTitleTd) {
              const $a = $td.children('a');
              line.title = $a.attr('title');
              line.tid = $a.attr('href').match(/[1-9]\d*/)[0];
            }
            // time
            if (isTimeTd) {
              line.ltime = `${curYear}-${$td.text()}`;
            }
            // author
            if (isAuthorTd) {
              line.author = $td.text();
            }
          }
        });
        result.push(line);
      }
    });
    return result;
  }

  // fetch detail info
  fetchDetail(tid) {
    const that = this;
    return new Promise((resolve, reject) => {
      console.log(`start fetchDetail at ${new Date()}`);
      axios
        .get(that.topicUrl + tid, createUserAgent())
        .then(res => {
          resolve(that.handleDetailData(res));
        })
        .catch(err => {
          console.error(`fetch id[${tid}] detail error`);
          reject(err);
        });
    });
  }

  // transform useful detail data
  handleDetailData(html) {
    const $ = cheerio.load(html);
    const text = $('#link-report .topic-richtext')
      .text()
      .trim();
    const cTime = $('#content h3 .color-green').text();
    const userface = $('.user-face img').attr('src');
    // extract useful infomations
    let houseInfo = extractHouse(text);
    houseInfo.content = text;
    houseInfo.ctime = cTime;
    houseInfo.userface = userface;

    //if have images, add to infomations
    const $imgs = $('#link-report img');
    if ($imgs.length) {
      let imgArr = [];
      $imgs.each(function() {
        imgArr.push($(this).attr('src'));
      });
      houseInfo.imgs = imgArr;
    }
    return houseInfo;
  }

  // update detail info
  async updateTopic(tid, resolve, reject) {
    // sleep
    await sleep(Math.ceil(Math.random() * 50 * 1000) + 5000);
    // fetch and update
    await this.fetchDetail(tid).then(houseInfo => {
      db.House.findOneAndUpdate({ tid: tid }, houseInfo, null)
        .then(() => {
          console.log(`success update tid ${tid}`);
          resolve();
        })
        .catch(err => {
          console.error(
            `findOneAndUpdate error, at ${new Date()}：${err.message}`
          );
          reject(err);
        });
    });
  }
  // write to mongodb
  insertToDB(data) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (data.length) {
        db.House.insertMany(data, { ordered: false })
          .then(doc => {
            console.log(`success insert ${data.length} data at ${new Date()}`);
            // avoid fetch duplicate tids, so after insert and fetch detail
            doc.map(item => {
              that.updateTopic(item.tid, resolve, reject);
            });
          })
          .catch(err => {
            if (data.length) {
              let errTids = [];
              // extract tid form data
              let originTids = [];
              data.map(item => {
                originTids.push(item.tid);
              });

              // error tids
              err.writeErrors.map(item => {
                let tidRes = item.errmsg.match(/(dup key\: \{).*(\d)+" \}/g);
                if (tidRes) {
                  let tid = tidRes[0].replace(/\D/g, '');
                  errTids.push(tid);
                }
              });
              console.log(`insert db fail tids：${JSON.stringify(errTids)}`);

              // save success ids for fetch detail
              let successTids = easyArrDiff(originTids, errTids);
              console.log(`success tids: ${JSON.stringify(successTids)}`);
              successTids.map(item => {
                that.updateTopic(item, resolve, reject);
              });
              reject(err);
            } else {
              reject('no data');
              console.error('have no data');
            }
          });
      }
    });
  }

  // judge if need delete
  handleDelete(maxNum, delNum) {
    db.House.countDocuments('tid').then(len => {
      return len >= maxNum ? Promise.resolve(this.deleteDB(delNum)) : false;
    });
  }

  // delete data from db
  deleteDB(num) {
    return new Promise(resolve => {
      const ids = [];

      // [{_id:123}, {_id:456}] => [123,456]
      db.House.find()
        .sort({ _id: 1 })
        .select('tid')
        .limit(num)
        .exec()
        .then(doc => {
          if (doc.length) {
            doc.map(e => {
              ids.push(e.tid);
            });
            db.House.remove({ tid: { $in: ids } }, (err, success) => {
              if (err) {
                console.error(err);
              } else {
                resolve();
                console.log(
                  `success delete ${success.n} data at ${new Date()}`
                );
              }
            });
          }
        });
    });
  }
}

module.exports = Robot;
