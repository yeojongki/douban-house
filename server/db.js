const mongoose = require('mongoose');
const config = require('./config');

// connect
mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.once('error', () => {
  console.error('mongodb connect error');
});
db.once('open', () => {
  console.error('mongodb connect success');
});

// create house schema
const houseSchema = new mongoose.Schema({
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
houseSchema.index({ tid: 1 }, { unique: true });

const House = mongoose.model('House', houseSchema);

House.on('index', error => {
  if (error) {
    console.log(`House collection create index error:${error}`);
  }
});

// create user schema
const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  ctime: String,
  ltime: String,
  likes: [String]
});
const User = mongoose.model('User', usersSchema);

module.exports = { House, User };
