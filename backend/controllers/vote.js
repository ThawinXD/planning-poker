import { rooms } from "../io.js";
import { io } from "../server.js";
import { validateRoomExists } from "./common.js";

function result(socket, data, estimations) {
  const votes = new Map();
  for (const [id, vote] of estimations.entries()) {
    if (!votes.has(vote)) votes.set(vote, 1);
    else votes.set(vote, votes.get(vote) + 1);
  }

  // socket.emit("estimationResult", { votes: Object.fromEntries(votes) });
  io.to(data.roomId).emit("estimationResult", {
    votes: Object.fromEntries(votes),
  });
}

export function voteController(socket) {
  socket.on("startVote", (data, res) => {
    try {
      if (!validateRoomExists(socket, data.roomId)) return;

      if (rooms[data.roomId].host !== data.user.id) {
        socket.emit("error", { message: "Only the host can start vote" });
        return;
      }

      rooms[data.roomId].estimations = { revealed: false, votes: new Map() };

      io.to(data.roomId).emit("voteStarted");
      res({ success: true });
      console.log(
        `Vote started in room ${data.roomId} by host ${data.user.id}`
      );
    } catch (error) {
      console.error("Error in startVote:", error);
      socket.emit("error", {
        message: "Failed to start vote",
        error: error.message,
      });
      res({ success: false, error: "Failed to start vote" });
    }
  });

  socket.on("vote", (data, res) => {
    try {
      if (!validateRoomExists(socket, data.roomId)) return;

      const hasRevealed = rooms[data.roomId].estimations.revealed;
      const hasVoted =
        rooms[data.roomId].estimations.votes.get(data.user.id) !== undefined;

      rooms[data.roomId].estimations.votes.set(data.user.id, data.vote);
      if (!hasRevealed && !hasVoted)
        socket.to(data.roomId).emit("userVoted", { name: data.user.name });
      if (hasRevealed) {
        socket.to(data.roomId).emit("changeVote", {
          name: data.user.name,
          vote: data.vote,
        });
        result(socket, data, rooms[data.roomId].estimations.votes);
      }

      console.log(`User ${data.user.id} voted in room ${data.roomId}`);
      res({ success: true });
    } catch (error) {
      console.error("Error in vote:", error);
      socket.emit("error", {
        message: "Failed to record vote",
        error: error.message,
      });
      res({ success: false, error: "Failed to record vote" });
    }
  });

  socket.on("revealVotes", (data, res) => {
    try {
      if (!validateRoomExists(socket, data.roomId)) return;
      if (rooms[data.roomId].host !== data.user.id) {
        socket.emit("error", { message: "Only the host can reveal votes" });
        return;
      }

      let estimations = [];
      for (const [userId, vote] of rooms[
        data.roomId
      ].estimations.votes.entries()) {
        name =
          rooms[data.roomId].users.find((user) => user.id === userId)?.name ||
          "Unknown";
        estimations.push({ name, vote });
      }
      io.to(data.roomId).emit("votesRevealed", { estimations });
      rooms[data.roomId].estimations.revealed = true;
      result(socket, data, rooms[data.roomId].estimations);
      console.log(
        `Votes revealed in room ${data.roomId} by host ${data.user.id}`
      );
      res({ success: true });
    } catch (error) {
      console.error("Error in revealVotes:", error);
      socket.emit("error", {
        message: "Failed to reveal votes",
        error: error.message,
      });
      res({ success: false, error: "Failed to reveal votes" });
    }
  });
}
