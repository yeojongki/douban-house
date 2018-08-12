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
  id: { type: String },
  title: String,
  time: String,
  url: String,
  writeTime: String
});

// housesSchema.index({ id: 1 }, { unique: true });

const Houses = mongoose.model('Houses', housesSchema);

Houses.ensureIndexes(function(err) {
  if (err) console.error(err);
});

Houses.on('index', function(error) {
  if (error) {
    console.log(`Houses collection create index error:${error}`);
  }
});

module.exports = { Houses: Houses };
