"use client";
import { useState } from "react";
import { AppDispatch, useAppSelector } from "../lib/store";
import { IUser } from "@/interfaces";
import { Link } from "@mui/material";

export default function Header() {
  const user: IUser | null = useAppSelector((state) => state.userSlice.user);
  const url: string | null = useAppSelector((state) => state.userSlice.url);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

  function handleLinkCopy() {
    if (typeof window !== "undefined" && url) {
      navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  }
  return (
    <header className="bg-blue-400 shadow relative top-0 left-0 w-full">
      <div className="flex flex-row">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Poker Planning Tool</h1>
          <div className="mt-2 text-gray-100">
            {user ? `Display name: ${user.name}` : "Not logged in"}
          </div>
        </div>
        <div className="ml-auto flex items-center px-4">
          {url && (
            <div>
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
        </div>
      </div>
    </header>
  );
}