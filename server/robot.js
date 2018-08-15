const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db');
const { scheduleJob, extractHouse, userAgents, write } = require('../util');

// random userAgent
const userAgentHeader = () => ({
  headers: {
    'User-Agent': userAgents[parseInt(Math.random() * userAgents.length)]
  }
});

// config axios
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * @param {any} cycle detail: https://www.npmjs.com/package/node-schedule
 * @param {Number} maxPage
 */
class Robot {
  constructor(
    cycle = { second: 50, minute: 48, hour: 0 },
    maxPage = 10,
    waitTime = 1000 * 10
  ) {
    this.groupPrefixUrl =
      'https://www.douban.com/group/gz020/discussion?start=';
    // group topic detail url
    this.topicUrl = 'https://www.douban.com/group/topic/';
    this.page = 0;
    this.waitTime = waitTime;
    this.maxPage = maxPage;
    this.cycle = cycle;
    this.timer = null;

    // console.time('fetch time');
    // this.fetchList().then(data => {
    //   this.insertToDB(data);
    //   console.timeEnd('fetch time');
    // });

    // this.init();
    this.fetchDetail(121771915);
    this.fetchDetail(120679774);
  }

  // init
  init() {
    // if need delete
    this.handleDelete();

    // everyday at 0:00am
    scheduleJob(this.cycle, () => {
      console.log(`start scheduleJob, time: ${new Date()}`);
      this.page = 0;
      // every 3 second fetch data & write to db
      this.timer = setInterval(() => {
        console.log(`start fetchList, current page: ${this.page}`);
        // only fetch maxPages
        if (this.page === this.maxPage) {
          clearInterval(this.timer);
        }

        this.fetchList().then(data => {
          this.insertToDB(data)
            .then(() => {
              this.page++;
            })
            .catch(() => {
              this.page++;
            });
        });
      }, this.waitTime);
    });
  }

  // fetch list
  fetchList() {
    const that = this;
    return new Promise((resolve, reject) => {
      axios
        .get(that.groupPrefixUrl + that.page * 25)
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
          if (isTitleTd || isAuthorTd) {
            // title & url
            if (isTitleTd) {
              const $a = $td.children('a');
              line.title = $a.attr('title');
              line.tid = $a.attr('href').match(/[1-9]\d*/);
            }
            // time
            if (isTimeTd) {
              line.ltime = $td.text();
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
      axios
        .get(that.topicUrl + tid, userAgentHeader())
        .then(res => {
          resolve(that.handleDetailData(res));
        })
        .catch(err => {
          console.error('fetch detail error');
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
    // extract useful infomations
    let houseInfo = extractHouse(text);
    houseInfo.content = text;
    houseInfo.ctime = cTime;

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

  // write to mongodb
  insertToDB(data) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (data.length) {
        db.Houses.insertMany(data)
          .then(doc => {
            console.log(`success insert ${data.length} data at ${new Date()}`);
            // avoid fetch duplicate tids, so after insert and fetch detail
            doc.map(item => {
              const tid = item.tid;
              that.fetchDetail(tid).then(houseInfo => {
                db.Houses.findOneAndUpdate({ tid: tid }, houseInfo, null)
                  .then(() => {
                    console.log(`success update tid '${tid}' at ${new Date()}`);
                    resolve();
                  })
                  .catch(err => {
                    console.error(
                      `findOneAndUpdate error, at ${new Date()}：${err.message}`
                    );
                    reject(err);
                  });
              });
            });
          })
          .catch(err => {
            console.error(`insert db fail, at ${new Date()}：${err.message}`);
            reject(err);
          });
      }
    });
  }

  // judge if need delete
  handleDelete(maxNum = 5000, delNum = 500) {
    return db.Houses.count() > maxNum ? this.deleteDB(delNum) : false;
  }

  // delete data from db
  deleteDB(num) {
    const ids = [];

    // [{_id:123}, {_id:456}] => [123,456]
    db.Houses.find()
      .sort({ _id: 1 })
      .select('tid')
      .limit(num)
      .exec()
      .then(doc => {
        doc.map(e => {
          ids.push(e.tid);
        });
        db.Houses.remove({ tid: { $in: ids } }, (err, success) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`success delete ${success.n} data at ${new Data()}`);
          }
        });
      });
  }
}

module.exports = Robot;
