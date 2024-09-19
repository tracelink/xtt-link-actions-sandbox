// jest.setup.js
const express = require('express');

// Create an Express app
const app = express();

// Define a route for running tests
app.get('/run-tests', (req, res) => {
  // Run tests here
  res.send('Tests are running...');
});

// Start the server
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Close the server after tests are done
afterAll(() => {
  server.close();
});

