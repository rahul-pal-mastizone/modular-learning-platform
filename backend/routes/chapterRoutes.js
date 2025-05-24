const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const { protect, allowRoles } = require('../middleware/authMiddleware');

// Create chapter (admin only)
router.post('/create', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { title, content, unitId } = req.body;
    const chapter = await Chapter.create({ title, content, unit: unitId });
    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ error: 'Error creating chapter' });
  }
});

// Get chapters for a unit
router.get('/:unitId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ unit: req.params.unitId });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching chapters' });
  }
});

module.exports = router;