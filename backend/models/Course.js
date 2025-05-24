const mongoose = require('mongoose');

// Chapter schema
const chapterSchema = new mongoose.Schema({
  title: String,
  content: String,
  questions: [
    {
      type: { type: String, enum: ['mcq', 'fill', 'text', 'audio'] },
      questionText: String,
      options: [String],
      correctAnswer: String,
      media: String
    }
  ]
});

// Unit schema
const unitSchema = new mongoose.Schema({
  title: String,
  chapters: [chapterSchema]
});

// Section schema
const sectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  units: [unitSchema]
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  sections: [sectionSchema] // ✅ Add full hierarchy
});

module.exports = mongoose.model('Course', courseSchema);
