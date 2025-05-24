const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },

  completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],

  score: Number,

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
