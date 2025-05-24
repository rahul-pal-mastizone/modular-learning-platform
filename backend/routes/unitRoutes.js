const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');
const { protect, allowRoles } = require('../middleware/authMiddleware');

// Create a unit (admin only)
router.post('/create', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { title, sectionId } = req.body;
    const unit = await Unit.create({ title, section: sectionId });
    res.status(201).json(unit);
  } catch (err) {
    res.status(500).json({ error: 'Error creating unit' });
  }
});

// Get all units under a section
router.get('/:sectionId', async (req, res) => {
  try {
    const units = await Unit.find({ section: req.params.sectionId });
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching units' });
  }
});

module.exports = router;
