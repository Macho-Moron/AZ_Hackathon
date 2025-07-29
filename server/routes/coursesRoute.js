const express = require('express');
const Course = require('../models/Course');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');


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



// POST /api/courses/:id/generate-details
router.post('/:id/generate-details', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    console.log(`Fleshing out course: ${course.topic}`);
    
    // --- POWERFUL PROMPT FOR DETAILED GENERATION ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an expert instructional designer. Based on the following course topic and outline, generate detailed content for each module.
      
      TOPIC: "${course.topic}"
      
      OUTLINE:
      ${course.outline}
      
      For EACH module in the outline, provide the following in a structured JSON format:
      1. "title": The title of the module.
      2. "explanation": A detailed, easy-to-understand explanation of the module's topic (2-3 paragraphs).
      3. "youtubeSuggestions": An array of 3 specific, relevant YouTube video search queries that would provide helpful tutorials or lectures on the topic.
      4. "mcqs": An array of 4 multiple-choice questions to test understanding. Each MCQ should have a "question", an array of 4 "options", and the "correctAnswer".
      
      Return ONLY a valid JSON object that is an array of these module objects, like this:
      [
        {
          "title": "Module 1 Title",
          "explanation": "Detailed text here...",
          "youtubeSuggestions": ["search query 1", "search query 2", "search query 3"],
          "mcqs": [
            { "question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": "..." },
            { "question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": "..." }
          ]
        },
        ...
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean the response to ensure it's valid JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const detailedModules = JSON.parse(text);

    // Update the course with the new detailed modules
    course.modules = detailedModules;
    await course.save();

    console.log('Successfully generated and saved detailed content.');
    res.status(200).json(course);

  } catch (error) {
    console.error('Error generating detailed course content:', error);
    res.status(500).json({ error: 'Failed to generate details.' });
  }
});

// DELETE /api/courses/:id - Deletes a specific course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course.' });
  }
});

module.exports = router;