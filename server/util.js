const jwt = require('jsonwebtoken');
const config = require('./config');
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
    setTimeout(resolve, time);
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

  let price = '';
  // price
  let resPricesPatt1 = pricesPatt1.exec(text);
  let resPricesPatt2;
  resPricesPatt1 ? (price = +resPricesPatt1[0]) : '';

  // no match pricesPatt1
  price ? '' : (resPricesPatt2 = pricesPatt2.exec(text));
  resPricesPatt2 && price ? (price = +resPricesPatt2[3]) : '';

  result.price = price;
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
    result.contact = null;
  }

  // size
  const resSize = sizePatt.exec(text);
  result.size = resSize ? +resSize[0].replace(/\D/g, '') : null;

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

// User-agent
const userAgents = [
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
  'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
];

const easyArrDiff = (arr1, arr2) => {
  let hash = {};
  let result = [];
  const handle = (a, b) => {
    a.map(item => {
      if (!b.includes(item)) {
        hash[item] = true;
        result.push(item);
      }
    });
  };
  if (arr1.length > arr2.length) {
    handle(arr1, arr2);
  } else {
    handle(arr2, arr1);
  }
  return result;
};

// ctx success return
const successRet = (data, msg = 'success', code = 1) => ({
  code,
  data,
  msg
});

// ctx error return
const errorRet = (msg = 'error', code = 0) => ({
  code,
  msg
});

// verify token by jsonwebtoken
const verifyToken = token => jwt.verify(token, config.secret);

// create token by jsonwebtoken
const createToken = (payload, secret = config.secret, t = config.expiresIn) =>
  jwt.sign(payload, secret, {
    expiresIn: t
  });

module.exports = {
  write,
  sleep,
  scheduleJob,
  extractHouse,
  userAgents,
  easyArrDiff,
  successRet,
  errorRet,
  verifyToken,
  createToken
};
