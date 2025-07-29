const mongoose = require('mongoose');

// Define a schema for a single MCQ
const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

// Define a schema for a single Module
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  youtubeSuggestions: [{ type: String }],
  mcqs: [mcqSchema],
});

// Main Course Schema
const courseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  outline: { // We'll keep the simple text outline
    type: String,
    required: true,
  },
  // This new field will hold the rich content
  modules: [moduleSchema], 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);