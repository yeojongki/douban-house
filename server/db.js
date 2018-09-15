const mongoose = require('mongoose');

// connect
mongoose.connect('mongodb://localhost:27017/douban-new');
const db = mongoose.connection;
db.once('error', () => {
  console.error('mongodb connect error');
});
db.once('open', () => {
  console.error('mongodb connect success');
});

// create schema
const housesSchema = new mongoose.Schema({
  tid: String,
  author: String,
  title: String,
  content: String,
  ctime: String,
  ltime: String,
  price: Number,
  contact: Object, // 联系方式
  size: Number, // 面积
  model: String, // 房型
  subway: String,
  area: String, // 地区
  imgs: [String],
  userface: String // 头像
});

// set tid index & unique
housesSchema.index({ tid: 1 }, { unique: true });

const Houses = mongoose.model('Houses', housesSchema);

Houses.on('index', error => {
  if (error) {
    console.log(`Houses collection create index error:${error}`);
  }
});

module.exports = { Houses: Houses };
