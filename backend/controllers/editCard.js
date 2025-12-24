import { rooms } from "../io.js";
import { io } from "../server.js";
import { validateRoomExists } from "./common.js";

export function cardController(socket) {
  socket.on("deleteCard", (data, res) => {
    if (!validateRoomExists(socket, data.roomId)) return;

    try {
      data.cards.forEach((cardId) => {
        const cardIndex = rooms[data.roomId].cards.findIndex(
          (card) => card.id === cardId
        );
        if (cardIndex !== -1) {
          rooms[data.roomId].cards.splice(cardIndex, 1);
        }
      });
      io.to(data.roomId).emit("cardsDeleted", { cards: data.cards });
      // socket.emit("cardsDeleted", { cards: data.cards });
      res({ success: true });
    } catch (error) {
      console.error("Error deleting cards:", error);
      socket.emit("error", {
        message: "Failed to delete cards",
        error: error.message,
      });
      res({ success: false, error: "Error deleting cards" });
    }
  });

  socket.on("addCard", (data, res) => {
    if (!validateRoomExists(socket, data.roomId)) return;
    try {
      data.cards.forEach((card) => {
        if (!rooms[data.roomId].cards.includes(card)) {
          rooms[data.roomId].cards.push(card);
        } else {
          socket.emit("error", {
            message: `Card ${card} already exists in room`,
          });
        }
      });

      io.to(data.roomId).emit("cardsAdded", { cards: data.cards });
      res({ success: true });
    } catch (error) {
      console.error("Error adding card:", error);
      socket.emit("error", {
        message: "Failed to add card",
        error: error.message,
      });
      res({ success: false, error: "Error adding card" });
    }
  });
}
