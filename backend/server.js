import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cors from 'cors';
import repl from 'repl';

dotenv.config({path: '.env'});

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const server = app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`));

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

export { app, server, io };

import { initializeSocketHandlers, rooms, users } from './io.js';
initializeSocketHandlers(io);

const r = repl.start({ prompt: 'server> ', useGlobal: false });

r.context.app = app;
r.context.server = server;
r.context.io = io;
r.context.env = { PORT, NODE_ENV, FRONTEND_URL };
r.context.rooms = rooms;
r.context.users = users;

r.context.cmd = {
  listRooms: () => Object.keys(rooms),
  getRoom: (roomId) => rooms[roomId],
  emitToRoom: (roomId, event, data) => io.to(roomId).emit(event, data),
};

console.log('REPL ready. Try: cmd.listRooms(), rooms, env');