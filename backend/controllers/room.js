import { rooms } from "../io.js";
import { validateRoomExists } from "./common.js";

export function roomController(socket) {
  socket.on('createRoom', (data) => {
    const roomId = Math.random().toString(36).substring(2, 10);
    rooms[roomId] = { users: [{userId: data.userId, userName: data.userName}] };
    rooms[roomId].host = data.userId;
    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
    console.log(`Room ${roomId} created by user ${data.userName}`);
  });

  socket.on('joinRoom', (data) => {
    if (!validateRoomExists(socket, data.roomId)) return;

    if (room.users.some(user => user.userName === data.userName)) {
      socket.emit('error', { message: 'Username already taken in this room' });
      return;
    }
    if (room.users.some(user => user.userId === data.userId)) {
      socket.emit('error', { message: 'User already in room' });
      return;
    }

    room.users.push({userId: data.userId, userName: data.userName});
    socket.join(data.roomId);
    socket.to(data.roomId).emit('userJoined', { userId: data.userId, userName: data.userName });
    console.log(`User ${data.userName} joined room ${data.roomId}`);
  });
}