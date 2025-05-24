const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Unit', unitSchema);
