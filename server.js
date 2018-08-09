const Koa = require('koa');
const app = new Koa();
const cheerio = require('cheerio');
const axios = require('axios');
const { write } = require('./util');

//爬取的网页地址
const url = 'https://www.douban.com/group/gz020/discussion?start=0';

// 配置axios
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

axios.get(url).then(res => {
  const $ = cheerio.load(res);
  const $trs = $('table tr');

  const result = [];
  $trs.each(function(i) {
    if (i > 1) {
      let line = {};
      const $tds = $(this).children('td');
      $tds.each(function() {
        let $td = $(this);
        // 只取标题和时间
        let isTitleTd = $td.hasClass('title');
        let isTimeTd = $td.hasClass('time');
        if (isTitleTd || isTimeTd) {
          // 标题 & 链接地址
          let isTitleTd = $td.hasClass('title');
          if (isTitleTd) {
            line.title = $td.children('a').attr('title');
            line.url = $td.children('a').attr('href');
          }
          // 时间
          if (isTimeTd) {
            line.time = $td.text();
          }
          result.push(line);
        }
      });
    }
  });

  // console.log(result);
  // 写出文件
  write('house.json', JSON.stringify(result));
});
