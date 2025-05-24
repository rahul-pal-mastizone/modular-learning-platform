const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.create({
      title,
      description,
      createdBy: req.user.id
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error while creating course' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching courses' });
  }
};
