const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
var cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const CHAT_MESSAGE = 'chat-message';
const VIDEO_PLAYBACK = 'video-playback';
const JOIN_ROOM = 'join-room';

io.on('connection', (socket) => {
  console.log('a user connected');
  // socket.id

  socket.on(JOIN_ROOM, ({ roomId, name }) => {
    socket.join(roomId);
    io.to(roomId).emit(CHAT_MESSAGE, {
      type: 'broadcast',
      roomId,
      name,
      message: `${name} joined the room`
    });

    socket.on(CHAT_MESSAGE, payload => {
      io.to(roomId).emit(CHAT_MESSAGE, payload);
    });

    socket.on(VIDEO_PLAYBACK, (payload) => {
      io.to(roomId).emit(VIDEO_PLAYBACK, payload);
    });

    socket.on('disconnect', (data) => {
      io.to(roomId).emit(CHAT_MESSAGE, {
        type: 'broadcast',
        roomId,
        name,
        message: `${name} left the room`
      });
    });
  });
});

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
