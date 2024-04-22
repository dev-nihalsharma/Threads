import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {};
io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap)); // sending event to everyone to get online users

  socket.on('markMessagesAsSeen', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
      await Conversation.updateOne({ _id: conversationId }, { $set: { 'lastMessage.seen': true } });

      socket.to(userSocketMap[userId]).emit('messagesSeen', { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // sending event to everyone to get online users
  });
});

export const getUserSocketId = (userId) => userSocketMap[userId];

export { io, app, server };
