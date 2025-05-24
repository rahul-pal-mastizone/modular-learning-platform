const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },

  questionText: { type: String, required: true },

  questionType: {
    type: String,
    enum: ['mcq', 'fill-in-the-blank', 'text', 'audio'],
    required: true
  },

  options: [String], // For MCQ
  correctAnswer: String, // Can be used for all types

  media: String // Optional: link to image/audio
});

module.exports = mongoose.model('Question', questionSchema);
