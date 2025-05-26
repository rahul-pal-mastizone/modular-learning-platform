const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow frontend requests from Vercel
app.use(cors({
  origin: 'https://modular-learning-platform.vercel.app',
  credentials: true,
}));

app.use(express.json());

// Route handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/units', require('./routes/unitRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/test', require('./routes/testRoutes'));

// Basic health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});