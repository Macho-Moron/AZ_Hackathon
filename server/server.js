const express = require('express');
const cors = require('cors');
const generateRoute = require('./routes/generateRoute');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// A simple test route
app.get('/', (req, res) => {
  res.send('The Text-to-Learn API is running!');
});

app.use('/api/generate', generateRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});