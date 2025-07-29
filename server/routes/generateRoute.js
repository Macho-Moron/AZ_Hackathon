const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Course = require('../models/Course');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { topic, userId } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a concise course outline for the topic: "${topic}". The outline should be a list of 5-7 main modules. Only return the list of modules.`;
    
    // --- START RETRY LOGIC ---
    let completion;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`Calling Gemini API (Attempt ${i + 1}) for:`, topic);
        const result = await model.generateContent(prompt);
        completion = result.response;
        break; // Success, exit loop
      } catch (error) {
        if (error.status === 503 && i < maxRetries - 1) {
          console.log('Model overloaded, retrying in 2 seconds...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        } else {
          throw error; // Rethrow error if it's not a 503 or if retries are exhausted
        }
      }
    }
    // --- END RETRY LOGIC ---

    const courseOutline = completion.text();
    console.log('Successfully received outline from Gemini.');

    const newCourse = new Course({
      topic: topic,
      outline: courseOutline,
      userId: userId,
    });
    await newCourse.save();
    console.log('Course saved to database.');

    res.status(200).json(newCourse);

  } catch (error) {
    console.error('Error in generate route:', error);
    res.status(500).json({ error: 'Failed to generate and save course.' });
  }
});

module.exports = router;