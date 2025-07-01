"use client";
import React, { useEffect, useState } from "react";
import AcceptIgnoreButton from "./AcceptIgnoreButton";

function FriendRequestCard({
  userId,
  friendRequestArray,
  setFriendRequestArray,
}: {
  userId: string;
  friendRequestArray: string[];
  setFriendRequestArray: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        console.log("hi");
        const res = await fetch(`/api/user/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();
        if (result.success) {
          setUsername(result.data.username);
          setName(result.data.name);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (err) {
        console.error("Request error:", err);
      }
    }
    getUser();
  }, []);

  return (
    <div className="bg-white border-1 rounded-sm flex flex-row items-center">
      <div className="p-2 pl-3 mr-auto">
        <div className="font-bold mb-[-3px]">{name}</div>
        <div className="mt-[-5px]">@{username}</div>
      </div>
      <div className="border-l-1 h-full grid grid-rows-2">
        <AcceptIgnoreButton
          userId={userId}
          action="ACCEPT"
          friendRequestArray={friendRequestArray}
          setFriendRequestArray={setFriendRequestArray}
        />
        <AcceptIgnoreButton
          userId={userId}
          action="REJECT"
          friendRequestArray={friendRequestArray}
          setFriendRequestArray={setFriendRequestArray}
        />
      </div>
    </div>
  );
}

export default FriendRequestCard;
