const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { createCourse, getCourses } = require('../controllers/courseController');

// Create a course
router.post('/', protect, allowRoles('admin'), createCourse);
  
// Get all courses
router.get('/', getCourses);

// Get full course content for learner
router.get('/:courseId/full', protect, allowRoles('learner'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error loading course content' });
  }
});

// Add a section
router.post('/:courseId/sections', protect, allowRoles('admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { title, description } = req.body;
    course.sections.push({ title, description });
    await course.save();

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error adding section' });
  }
});

// Add a unit
router.post('/:courseId/sections/:sectionIndex/units', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { courseId, sectionIndex } = req.params;
    const { title } = req.body;

    const course = await Course.findById(courseId);
    if (!course || !course.sections[sectionIndex]) {
      return res.status(404).json({ error: 'Course or Section not found' });
    }

    course.sections[sectionIndex].units.push({ title, chapters: [] });
    await course.save();

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error adding unit' });
  }
});

// Add a chapter
router.post('/:courseId/sections/:sectionIndex/units/:unitIndex/chapters', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { courseId, sectionIndex, unitIndex } = req.params;
    const { title, content } = req.body;

    const course = await Course.findById(courseId);
    if (!course || !course.sections[sectionIndex]?.units[unitIndex]) {
      return res.status(404).json({ error: 'Course/Section/Unit not found' });
    }

    course.sections[sectionIndex].units[unitIndex].chapters.push({ title, content, questions: [] });
    await course.save();

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error adding chapter' });
  }
});

// Add a question
router.post('/:courseId/sections/:sectionIndex/units/:unitIndex/chapters/:chapterIndex/questions', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { courseId, sectionIndex, unitIndex, chapterIndex } = req.params;
    const { type, questionText, options, correctAnswer, media } = req.body;

    const course = await Course.findById(courseId);
    const chapter = course?.sections[sectionIndex]?.units[unitIndex]?.chapters[chapterIndex];

    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    chapter.questions.push({ type, questionText, options, correctAnswer, media });
    await course.save();

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error adding question' });
  }
});

// Enroll learner in course
router.post('/:courseId/enroll', protect, allowRoles('learner'), async (req, res) => {
  try {
    const exists = await UserProgress.findOne({ user: req.user.id, course: req.params.courseId });

    if (exists) {
      return res.status(400).json({ error: 'Already enrolled' });
    }

    const progress = new UserProgress({
      user: req.user.id,
      course: req.params.courseId
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Error enrolling in course' });
  }
});

// Get enrolled courses for learner
router.get('/enrolled/me', protect, allowRoles('learner'), async (req, res) => {
  try {
    const enrolled = await UserProgress.find({ user: req.user.id }).populate('course');
    res.status(200).json(enrolled);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching enrolled courses' });
  }
});

// Save progress for completed chapter
router.post('/:courseId/progress/complete', protect, allowRoles('learner'), async (req, res) => {
  try {
    const { chapterId, score } = req.body;
    const courseId = req.params.courseId;

    let progress = await UserProgress.findOne({ user: req.user.id, course: courseId });

    if (!progress) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId);
    }

    progress.score = score;
    progress.updatedAt = new Date();

    await progress.save();

    res.status(200).json({ message: 'Progress saved' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving progress' });
  }
});

module.exports = router;
