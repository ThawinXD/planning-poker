import { rooms } from "../io.js";
import { validateRoomExists } from "./common.js";

export function estimationController(socket) {
  socket.on('startEstimation', (data) => {
    if (!validateRoomExists(socket, data.roomId)) return;

    if (rooms[data.roomId].host !== data.userId) {
      socket.emit('error', { message: 'Only the host can start estimation' });
      return;
    }

    rooms[data.roomId].estimations = {};

    io.to(data.roomId).emit('estimationStarted');
    console.log(`Estimation started in room ${data.roomId} by host ${data.userId}`);
  });
}