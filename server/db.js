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
  contact: Object,
  size: Number,
  model: String,
  subway: String,
  area: String,
  imgs: [String]
});

housesSchema.index({ tid: 1 }, { unique: true });

const Houses = mongoose.model('Houses', housesSchema);

Houses.on('index', error => {
  if (error) {
    console.log(`Houses collection create index error:${error}`);
  }
});

module.exports = { Houses: Houses };
