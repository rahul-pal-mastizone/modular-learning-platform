const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow frontend from Vercel
const corsOptions = {
  origin: 'https://modular-learning-platform.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests


// Parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/sections', require('./routes/sectionRoutes'));
app.use('/api/units', require('./routes/unitRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/test', require('./routes/testRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});