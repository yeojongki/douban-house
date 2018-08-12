const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db');
const { scheduleJob, sleep } = require('../util');

// config axios
axios.defaults.headers.get['User-Agent'] =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36';
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

class Robot {
  constructor() {
    const prefixUrl = 'https://www.douban.com/group/gz020/discussion?start=';
    this.page = 0;
    this.url = `${prefixUrl + this.page * 25}`;
    this.timer = null;
    // everyday at 0:00am
    scheduleJob({ second: 0, minute: 0, hour: 0 }, () => {
      console.log(`start scheduleJob, time: ${new Date()}`);
      this.page = 0;
      // every 3 second fetch data & write to db
      this.timer = setInterval(() => {
        console.log(`start fetchData, current page: ${this.page}`);
        // only fetch 10 pages
        if (this.page === 10) {
          clearInterval(this.timer);
        }

        this.fetchData().then(data => {
          this.insertToDB(data);
          this.page++;
        });
      }, 3000);
    });
  }

  // fetch data
  fetchData() {
    const that = this;
    return new Promise((resolve, reject) => {
      axios
        .get(that.url)
        .then(res => {
          resolve(that.handleData(res));
        })
        .catch(err => {
          console.error('fetch data error');
          reject(err);
        });
    });
  }

  // transfer useful data
  handleData(data) {
    const result = [];
    const $ = cheerio.load(data);
    const $trs = $('table tr');
    const writeTime = +new Date();
    $trs.each(function(i) {
      if (i > 1) {
        let line = {};
        const $tds = $(this).children('td');
        $tds.each(function() {
          let $td = $(this);
          // only need `title` & `time` td
          let isTitleTd = $td.hasClass('title');
          let isTimeTd = $td.hasClass('time');
          if (isTitleTd || isTimeTd) {
            // title & url
            let isTitleTd = $td.hasClass('title');
            if (isTitleTd) {
              line.title = $td.children('a').attr('title');
              line.url = $td.children('a').attr('href');
            }
            // time
            if (isTimeTd) {
              line.time = $td.text();
            }
            // write db time
            line.writeTime = writeTime;
            result.push(line);
          }
        });
      }
    });
    return result;
  }

  // write to mongodb
  insertToDB(data) {
    if (data.length) {
      db.Houses.insertMany(data, err => {
        if (err) {
          console.error('fail to insert data');
        }
      });
    }
  }
}

module.exports = Robot;
