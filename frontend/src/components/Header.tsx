"use client";
import { useState } from "react";
import { AppDispatch, useAppSelector } from "../lib/store";
import { IResRoom, IUser } from "@/interfaces";
import { Button, Link } from "@mui/material";
import { setURL } from "../lib/features/user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import socket from "../socket";

export default function Header() {
  const router = useRouter();
  const user: IUser | null = useAppSelector((state) => state.userSlice.user);
  const url: string | null = useAppSelector((state) => state.userSlice.url);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  function handleLinkCopy() {
    if (typeof window !== "undefined" && url) {
      navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  }

  function handleLeaveRoom() {
    if (!user || !url) return;
    socket.emit("leaveRoom", { user }, (res: IResRoom) => {
      if (res.success) {
        console.log("Left room successfully");
      } else {
        console.error("Error leaving room:", res.error);
      }
    });
    dispatch(setURL(null));
    router.push("/");
  }
  return (
    <header className="bg-blue-400 shadow relative top-0 left-0 w-full h-[15vh]">
      <div className="flex flex-row w-full h-full">
        <div className="ml-50 py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Poker Planning Tool</h1>
          <div className="mt-2 text-gray-100">
            {user ? `Display name: ${user.name}` : "Not logged in"}
          </div>
        </div>
        {url && (
          <div className="ml-auto flex items-center px-4">
            <Link
              href="#"
              underline="hover"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                handleLinkCopy();
              }}
            >
              {url}
              <p className="text-md">{isLinkCopied ? "(Copied!)" : "(Click to copy)"}</p>
            </Link>
          </div>
        )}
        {url && (
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleLeaveRoom();
            }}
          >
            Leave
          </Button>
        )}
      </div>
    </header>
  );
}