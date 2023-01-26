//console.log(`Server is running on port`);
// import app frthe app.js file
const server = require('./app');

// import dotenv for environment variables
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

//socket
const socket =require("socket.io");

// Set port to environment variable or 3000
const port = process.env.PORT || 5000;

// Start server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// //chat
// const io= socket(server,{
//     cors:{
//         origin:"http://localhost:5000",
//         credentials: true,
//     },
// });

// global.onlineUsers =new Map();

// io.on("connection",(socket)=>{
//     global.chatSocket = socket;
//     socket.on("add-user",(userId)=>{
//         onlineUsers.set(userId,socket.id);
//     });

//     socket.on("send-msg",(data)=>{
//         const sendUserSocket=onlineUsers.get(data.to);
//         if(sendUserSocket) {
//             socket.to(sendUserSocket).emit("msg-recived",data.msg);
//         }
//     });
// });