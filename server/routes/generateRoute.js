const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Course = require('../models/Course'); // <-- IMPORT THE COURSE MODEL
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { topic } = req.body;
  console.log('Received topic, calling Gemini API for:', topic);

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a concise course outline for the topic: "${topic}". The outline should be a list of 5-7 main modules. Only return the list of modules.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const courseOutline = response.text();
    console.log('Successfully received outline from Gemini.');

    // --- SAVE TO DATABASE ---
    const newCourse = new Course({
      topic: topic,
      outline: courseOutline,
    });
    await newCourse.save();
    console.log('Course saved to database.');
    // -----------------------

    res.status(200).json(newCourse); // <-- SEND THE SAVED COURSE BACK

  } catch (error) {
    console.error('Error in generate route:', error);
    res.status(500).json({ error: 'Failed to generate and save course.' });
  }
});

module.exports = router;