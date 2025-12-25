import { rooms } from "../io.js";

export function validateRoomExists(socket, roomId) {
  if (!rooms[roomId]) {
    console.log(`Room ${roomId} not found for socket ${socket.id}`);
    socket.emit("error", { message: "Room not found" });
    return false;
  }
  return true;
}
