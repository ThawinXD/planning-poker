import { Server } from "socket.io";
import { server } from "./server.js";
import { roomController } from "./controllers/room.js";
import { voteController } from "./controllers/vote.js";
import { messageController } from "./controllers/sendMessage.js";
import { estimationController } from "./controllers/estimation.js";

const io = new Server(server);
export const rooms = {};

function validateRoomExists(socket, roomId) {
  if (!rooms[roomId]) {
    socket.emit('error', { message: 'Room not found' });
    return false;
  }
  return true;
}

io.on('connection', (socket) => {
  console.log('A user connected');

  roomController(socket);

  voteController(socket);

  messageController(socket);

  estimationController(socket);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export { io };