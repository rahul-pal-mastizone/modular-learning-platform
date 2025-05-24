const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const { protect, allowRoles } = require('../middleware/authMiddleware');

// Create a section (admin only)
router.post('/create', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const section = await Section.create({ title, course: courseId });
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ error: 'Error creating section' });
  }
});

// Get all sections for a course
router.get('/:courseId', async (req, res) => {
  try {
    const sections = await Section.find({ course: req.params.courseId });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching sections' });
  }
});

module.exports = router;
