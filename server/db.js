const mongoose = require('mongoose');

// connect
mongoose.connect('mongodb://localhost:27017/douban-house');
const db = mongoose.connection;
db.once('error', () => {
  console.error('mongodb connect error');
});
db.once('open', function() {
  console.error('mongodb connect success');
});

// create schema
const housesSchema = new mongoose.Schema({
  title: String,
  time: String,
  url: String,
  writeTime: Number
});

const Houses = mongoose.model('Houses', housesSchema);

module.exports = { Houses: Houses };
