const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const { protect } = require('../middleware/authMiddleware');

// Save or update progress
router.post('/save', protect, async (req, res) => {
  const { course, section, unit, chapter, score } = req.body;

  try {
    let progress = await UserProgress.findOne({
      user: req.user.id,
      course,
    });

    if (!progress) {
      progress = await UserProgress.create({
        user: req.user.id,
        course,
        section,
        unit,
        chapter,
        completedChapters: [chapter],
        score
      });
    } else {
      if (!progress.completedChapters.includes(chapter)) {
        progress.completedChapters.push(chapter);
      }
      progress.chapter = chapter;
      progress.section = section;
      progress.unit = unit;
      progress.score = score;
      progress.updatedAt = Date.now();
      await progress.save();
    }

    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Error saving progress' });
  }
});

// Get learner's progress
router.get('/', protect, async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.user.id }).populate('course chapter');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching progress' });
  }
});

module.exports = router;
