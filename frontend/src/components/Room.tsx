"use client";

import { IResRoom, IRoom, IRoomUser, IUser } from "@/interfaces";
import { useCallback, useEffect, useState } from "react";
import socket from "../socket";
import { Snackbar, Button } from "@mui/material";

export default function RoomPageIn({ user, roomId }: { user: IUser; roomId: string | null }) {
  const [room, setRoom] = useState<IRoom | null>(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [canVote, setCanVote] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [selectCard, setSelectCard] = useState<string>("");

  const getRoomData = useCallback(() => {
    console.log("Fetching room data for roomId:", roomId);
    if (!roomId) return;
    socket.emit("getRoomData", roomId, (res: { success: boolean; room?: IRoom; error?: string }) => {
      if (res.success && res.room) {
        setRoom(res.room);
        setCanVote(res.room.canVote);
        setIsRevealed(res.room.revealed);
        // console.log("Room data updated:", res.room);
      } else {
        console.error("Error getting room data:", res.error);
      }
    });
  }, [roomId]);

  useEffect(() => {
    setTimeout(() => {
      if (roomId) getRoomData();
    }, 500);
  }, [roomId, getRoomData]);

  useEffect(() => {
    const onUserJoined = (data: IRoomUser) => {
      setSnackbarMessage(`User joined: ${data.name}`);
      setShowSnackbar(true);
      getRoomData();
    };
    const onUserLeft = (data: IRoomUser) => {
      setSnackbarMessage(`User left: ${data.name}`);
      setShowSnackbar(true);
      getRoomData();
    };
    const onVoteStarted = () => {
      setSnackbarMessage("Vote started");
      setShowSnackbar(true);
      getRoomData();
    };
    const onResetVote = () => {
      setSnackbarMessage("Vote reset");
      setShowSnackbar(true);
      getRoomData();
    };
    const onVoteReviewed = () => {
      setSnackbarMessage("Votes revealed");
      setShowSnackbar(true);
      getRoomData();
    }

    // Guard against duplicated listeners in dev (Fast Refresh / StrictMode)
    socket.off("userJoined");
    socket.off("userLeft");
    socket.off("voteStarted");
    socket.off("resetVote");
    socket.off("voteReviewed");

    socket.on("userJoined", onUserJoined);
    socket.on("userLeft", onUserLeft);
    socket.on("voteStarted", onVoteStarted);
    socket.on("resetVote", onResetVote);
    socket.on("voteReviewed", onVoteReviewed);

    return () => {
      socket.off("userJoined", onUserJoined);
      socket.off("userLeft", onUserLeft);
      socket.off("voteStarted", onVoteStarted);
      socket.off("resetVote", onResetVote);
      socket.off("voteReviewed", onVoteReviewed);
    };
  }, [getRoomData]);

  function handleStartVote() {
    if (!room) return;
    if (room.host !== user.name) {
      alert("Only the host can start the vote.");
      return;
    }
    // Rely on the "voteStarted" event to refresh; avoid double getRoomData()
    socket.emit("startVote", { roomId: room.roomId, user }, (res: IResRoom) => {
      if (!res.success) {
        console.error("Error starting vote:", res.error);
      }
    });
  }

  function handleRevealCards() {
    if (!room) return;
    if (room.host !== user.name) {
      alert("Only the host can reveal the cards.");
      return;
    }
    socket.emit("revealVotes", { roomId: room.roomId, user }, (res: IResRoom) => {
      if (res.success) {
        getRoomData();
      } else {
        console.error("Error revealing cards:", res.error);
      }
    });
  }

  function handleVote(card: string) {
    if (!room) return;
    if (!canVote) {
      alert("Voting is not allowed at this time.");
      return;
    }
    socket.emit("vote", { roomId: room.roomId, user, vote: card }, (res: IResRoom) => {
      if (res.success) {
        setSelectCard(card);
        getRoomData();
      } else {
        console.error("Error submitting vote:", res.error);
      }
    });
  }

  return (
    <div>
      {showSnackbar && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={showSnackbar}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
          key={"topcenter"}
        />
      )}
      <div>
        {room ? (
          <div>
            <p>Room ID: {room.roomId}</p>
            <p>Host: {room.host}</p>
            <p>Users: {room.users.map(u => u.name).join(", ")}</p>
            <p>Cards: {room.cards.join(", ")}</p>
            <p>Revealed: {isRevealed ? "Yes" : "No"}</p>
            <div>Estimations:</div>
            {room.estimations? room.estimations.map(estimation => (
              <div key={estimation.name}>{estimation.name}: {estimation.vote}</div>
            )): "No estimations yet"}
            <div>Result Card:</div>
            {room.resultCard}
          </div>
        ) : ""}
      </div>
      <div className="mt-4">
        <Button variant="contained" color="primary" onClick={handleStartVote} className="mr-2">
          Start Vote
        </Button>
        <Button variant="contained" color="secondary" onClick={handleRevealCards} className="mr-2">
          Reveal Cards
        </Button>
        <div className="mt-4">
          <p>Select your card to vote:</p>
          {room && room.cards.map((card) => (
            <Button
              key={card}
              variant={selectCard === card ? "contained" : "outlined"}
              color="primary"
              onClick={() => {
                setSelectCard(card);
                handleVote(card);
              }}
              className="mr-2 mb-2"
            >
              {card}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}