// Import express for server
// Import cors for cross origin resource sharing
const express = require('express');
const cors = require('cors');
const { forgotPassword } = require("./src/controllers/userController");

// Create express server with express function
const server = express();

// Use cors and express.json() for parsing json data
server.use(cors());
server.use(express.json());
// Import routes
const userRoutes = require('./src/routes/userRoutes');
const facultyRoutes = require('./src/routes/facultyRoutes');
const messageRoutes = require('./src/routes/messagesRoutes');


// assign main route to the endpoints
server.use('/messages',messageRoutes);
server.use('/faculty', facultyRoutes);
server.use('/user', userRoutes);


server.post("/forget-password", forgotPassword);

// Establish Connection to db
require("./src/db/conn");
// connectDB();

// export server
module.exports = server;