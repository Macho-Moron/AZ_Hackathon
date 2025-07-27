const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Google AI with the API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { topic } = req.body;
  console.log('Received topic, calling Gemini API for:', topic);

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    // Specify the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create the prompt
    const prompt = `Generate a concise course outline for the topic: "${topic}". The outline should be a list of 5-7 main modules. Only return the list of modules.`;

    // Call the AI to generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const courseOutline = response.text();

    console.log('Successfully received outline from Gemini.');

    // Send the real course outline back to the frontend
    res.status(200).json({
      message: "Course outline generated successfully!",
      outline: courseOutline,
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate course outline from AI.' });
  }
});

module.exports = router;