const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect, allowRoles } = require('../middleware/authMiddleware');

// Create a question (admin only)
router.post('/create', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { chapterId, questionText, questionType, options, correctAnswer, media } = req.body;

    const question = await Question.create({
      chapter: chapterId,
      questionText,
      questionType,
      options,
      correctAnswer,
      media
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Error creating question' });
  }
});

// Get all questions of a chapter
router.get('/:chapterId', async (req, res) => {
  try {
    const questions = await Question.find({ chapter: req.params.chapterId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

module.exports = router;