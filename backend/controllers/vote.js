import { rooms } from "../io.js";
import { validateRoomExists } from "./common.js";

export function voteController(socket) {
  socket.on('vote', (data) => {
    if (!validateRoomExists(socket, data.roomId)) return;

    rooms[data.roomId].estimations[data.userId] = data.vote;
    socket.to(data.roomId).emit('userVoted', { userId: data.userId });
    console.log(`User ${data.userId} voted in room ${data.roomId}`);
  });

  socket.on('revealVotes', (data) => {
    if (!validateRoomExists(socket, data.roomId)) return;
    if (rooms[data.roomId].host !== data.userId) {
      socket.emit('error', { message: 'Only the host can reveal votes' });
      return;
    }

    const estimations = rooms[data.roomId].estimations;
    io.to(data.roomId).emit('votesRevealed', { estimations });
    console.log(`Votes revealed in room ${data.roomId} by host ${data.userId}`);
  });
}