const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// A simple test route
app.get('/', (req, res) => {
  res.send('The Text-to-Learn API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});