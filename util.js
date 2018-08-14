const fs = require('fs');
const schedule = require('node-schedule');

// write file
function write(path = 'file.txt', txt = 'this is the default text') {
  fs.writeFile(path, txt, function(err) {
    if (err) {
      console.error('fail to write');
    } else {
      console.log(`success to write file: ${path}`);
    }
  });
}

// sleep
function sleep(time = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// schedule job
function scheduleJob(time, fn) {
  return schedule.scheduleJob(time, fn);
}

// extract house infomations
function extractHouse(text) {
  const pricesPatt1 = /\d{3,5}(?=元|\/月|每月|一个月|每个月)/g;
  const pricesPatt2 = /(月租|租金|价钱|价格|房租)(:|：| )*(\d{3,5})/g;
  const contactPatt = /((手机|电话|微信|v|qq|QQ)号?(:|：|\s)?(\s)?([\d\w_一二两三四五六七八九零]{5,}))/;
  const sizePatt = /(\d{1,3})(多)?[平|㎡]/;
  const modelPatt = /(([\d一二两三四五六七八九])[居室房]([123一二两三]厅)?([12一二两]厨)?([1234一二两三四]卫)?([12一二两]厨)?)/;
  const subwayPatt = /[\d一二两三四五六七八九十(十一)(十二)(十三)(十四)(apm)(APM)(广佛)]号线/;
  const areaPatt = /(天河|越秀|荔湾|海珠|番禺|白云|黄埔|从化|增城|花都|南沙)/;
  const result = {};

  // price
  const prices = [];
  resPricesPatt1 = pricesPatt1.exec(text);
  resPricesPatt2 = pricesPatt2.exec(text);
  resPricesPatt1 && prices.push(+resPricesPatt1[0]);
  resPricesPatt2 && prices.push(+resPricesPatt2[3]);
  result.prices = prices.length > 1 ? Array.from(new Set(prices)) : prices;

  // contact way
  const contactTypeMap = {
    手机: 'mobile',
    电话: 'phone',
    微信: 'wechat',
    v: 'wechat',
    qq: 'qq',
    QQ: 'qq'
  };
  const contactResult = contactPatt.exec(text);
  if (contactResult) {
    const contactType = contactTypeMap[contactResult[2]];
    const contactValue = contactResult[5];
    result.contact = { type: contactType, value: contactValue };
  } else {
    result.contact = {};
  }

  // size
  const resSize = sizePatt.exec(text);
  result.size = resSize ? resSize[0] : null;

  // model
  const resModel = modelPatt.exec(text);
  result.model = resModel ? resModel[0] : null;

  // subway
  const subwayMap = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    十一: 11,
    十二: 12,
    十三: 13,
    十四: 14,
    广佛: '广佛',
    apm: 'APM',
    APM: 'APM'
  };
  // '1'/'一'
  const resSubway = subwayPatt.exec(text);
  if (resSubway) {
    let line = subwayPatt.exec(text)[0].replace('号线', '');
    result.subway = isNaN(+line) ? subwayMap[line] : +line;
  }

  // area
  const resArea = areaPatt.exec(text);
  result.area = resArea ? resArea[0] : null;

  return result;
}

module.exports = {
  write: write,
  sleep: sleep,
  scheduleJob: scheduleJob,
  extractHouse: extractHouse
};
