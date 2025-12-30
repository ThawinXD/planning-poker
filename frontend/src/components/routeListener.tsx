"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import socket from "../socket";
import { IUser } from "@/interfaces";
import { useAppSelector } from "../lib/store";


export default function RouteListener() {
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const user: IUser | null = useAppSelector((state) => state.userSlice.user);
  
  useEffect(() => {
    if (currentPath.current === "/room" && pathname !== "/room") {
      if (!user) return;
      socket.emit("leaveRooms", {user});
    }

    currentPath.current = pathname;
  }, [pathname]);

  return <></>
}