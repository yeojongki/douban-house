const fs = require('fs');
function write(path, txt) {
  fs.writeFile(path, txt, function(err) {
    if (err) {
      console.error('写入文件失败');
      return false;
    } else {
      console.log('写入成功');
    }
  });
}

module.exports = {
  write: write
};
