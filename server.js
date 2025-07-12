const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

let connectedUsers = 0;
let messages = [];

io.on('connection', (socket) => {
  connectedUsers++;
  console.log(`User connected. Total users: ${connectedUsers}`);
  
  socket.emit('previous_messages', messages);
  io.emit('user_count', connectedUsers);

  socket.on('send_message', (data) => {
    const messageData = {
      id: Date.now() + Math.random(),
      username: data.username || 'Người ẩn danh',
      message: data.message,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
    
    messages.push(messageData);
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    io.emit('receive_message', messageData);
  });

  socket.on('user_typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  socket.on('user_stopped_typing', () => {
    socket.broadcast.emit('user_stopped_typing');
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`User disconnected. Total users: ${connectedUsers}`);
    io.emit('user_count', connectedUsers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
