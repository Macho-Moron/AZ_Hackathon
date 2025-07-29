require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const generateRoute = require('./routes/generateRoute');
const coursesRoute = require('./routes/coursesRoute'); // <-- IMPORT NEW ROUTE

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/generate', generateRoute);
app.use('/api/courses', coursesRoute); // <-- USE NEW ROUTE

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

startServer();