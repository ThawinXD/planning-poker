"use client";
import { AppDispatch, useAppSelector } from "@/src/lib/store";
import { useEffect, useState } from "react";
import { IUser, IResRoom } from "@/interfaces";
import socket from "@/src/socket";
import { setUserId, setUserName } from "@/src/lib/features/user";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import TextfieldName from "@/src/components/TextfieldName";
import AlertDialog from "@/src/components/DialogMe";

export default function RoomPage() {
  const user: IUser = useAppSelector((state) => state.userSlice.user as IUser);
  const dispatch = useDispatch<AppDispatch>();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const readHash = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      setRoomId(hash ? hash.substring(1) : null);
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsSocketConnected(true);
      if (socket.id)
        dispatch(setUserId(socket.id));
      console.log("Socket connected:", socket.id);

      if (!user.name || user.name === "") {
        setShowNamePrompt(true);
      }

      if (roomId) {
        socket.emit("joinRoom", { roomId: roomId, user: user }, (res: IResRoom) => {
          if (res.success) {
            console.log("Joined room with ID:", roomId);
          } else {
            console.error("Error joining room:", res.error);
            if (res.action === 0) {
              setShowNamePrompt(true);
            }
            else {
              setShowAlert(true);
            }
          }
        });
      }
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [dispatch, roomId, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (name)
        dispatch(setUserName(name));
    }, 500);

    return () => clearTimeout(timer);
  }, [name, dispatch]);

  useEffect(() => {
    console.log("Room ID from URL hash:", roomId);
    if (!roomId) {
      // console.log("No room ID found in URL.");
      // setShowAlert(true);
      return;
    }
    if (user.name === "" || !user.name) {
      setShowNamePrompt(true);
    }

    socket.emit("joinRoom", { roomId: roomId, user: user }, (res: IResRoom) => {
      if (res.success) {
        console.log("Joined room with ID:", roomId);
      } else {
        console.error("Error joining room:", res.error);
        setShowAlert(true);
      }
    });
  }, [roomId]);

  function submitName(e: string) {
    dispatch(setUserName(e));
    setShowNamePrompt(false);
  }

  function handleAlertAgree() {
    setShowAlert(false);
    router.push("/");
  }

  return (
    <>
      {showNamePrompt && (
        <div className="items-center justify-center fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex">
          <TextfieldName
            name={name}
            setName={setName}
            submitName={submitName}
          />
        </div>
      )}
      <div>
      <p>Room Page</p>
      {roomId ? (
        <p>Room ID: {roomId}</p>
      ) : (
        <p>No Room ID found in URL.</p>
      )}
      {showAlert && (
        // <Alert severity="error" onClose={() => {
        //   setShowAlert(false)
        //   router.push("/");
        // }}>
        //   Please provide a valid Room ID in the URL or Exited one.
        // </Alert>
        <AlertDialog
          title="Invalid Room"
          description="Please provide a valid Room ID in the URL or Exited one."
          onAgree={handleAlertAgree}
        />
      )}
      </div>
    </>
  );
}