const fs = require('fs');
const schedule = require('node-schedule');

function write(path = 'file.txt', txt = 'this is the default text') {
  fs.writeFile(path, txt, function(err) {
    if (err) {
      console.error('fail to write');
    } else {
      console.log('success to write');
    }
  });
}

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
module.exports = {
  write: write,
  sleep: sleep,
  scheduleJob: scheduleJob
};
