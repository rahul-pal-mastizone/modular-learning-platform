const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/authMiddleware');

// Only logged in users can access this
router.get('/private', protect, (req, res) => {
  res.send(`Hello ${req.user.role}, you are logged in.`);
});

// Only admin users can access this
router.get('/admin-only', protect, allowRoles('admin'), (req, res) => {
  res.send('Welcome admin. You are allowed to manage courses.');
});

module.exports = router;
