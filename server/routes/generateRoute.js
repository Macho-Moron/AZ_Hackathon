const express = require('express');
const router = express.Router();

// POST /api/generate
router.post('/', (req, res) => {
  const { topic } = req.body;

  console.log('Received topic on backend:', topic);

  // Basic validation
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  // TODO: Add logic to call the AI service here

  // For now, send back a dummy success response
  res.status(200).json({
    message: `Successfully received topic: ${topic}. Course generation will start soon.`,
    courseId: `temp_${Date.now()}` // Sending a temporary ID
  });
});

module.exports = router;