const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  outline: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);