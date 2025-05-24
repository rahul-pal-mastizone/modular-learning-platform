const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chapter', chapterSchema);
