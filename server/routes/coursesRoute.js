const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// GET /api/courses - Fetches all saved courses
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; 
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    const courses = await Course.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

module.exports = router;