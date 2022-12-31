//console.log(`Server is running on port`);
// import app frthe app.js file
const server = require('./app');

// import dotenv for environment variables
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

// Set port to environment variable or 3000
const port = process.env.PORT || 3000;

// Start server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});