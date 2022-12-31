// Import express for server
// Import cors for cross origin resource sharing
const express = require('express');
const cors = require('cors');

// Create express server with express function
const server = express();

// Use cors and express.json() for parsing json data
server.use(cors());
server.use(express.json());

// Import routes
const userRoutes = require('./src/routes/userRoutes');

// assign main route to the endpoints
server.use('/user', userRoutes);

// Establish Connection to db
require("./src/db/conn");
// connectDB();

// export server
module.exports = server;