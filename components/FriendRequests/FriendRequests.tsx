"use client";
import React, { useEffect, useState } from "react";
import FriendRequestCard from "./FriendRequestCard";
import { set } from "zod";

function FriendRequests() {
  const [friendRequestArray, setFriendRequestArray] = useState<string[]>([]);

  useEffect(() => {
    async function getFriendRequests() {
      try {
        console.log("hi");
        const res = await fetch("/api/friend/requests", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();
        if (result.success) {
          setFriendRequestArray(result.data);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (err) {
        console.error("Request error:", err);
      }
    }
    getFriendRequests();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="mb-[-0.6em] mt-[-0.4em] font-bold">Friend Requests</div>
      <div className="text-[10px] italic">Fully Client Component</div>
      {friendRequestArray.map((item) => (
        <FriendRequestCard
          userId={item}
          key={item}
          friendRequestArray={friendRequestArray}
          setFriendRequestArray={setFriendRequestArray}
        />
      ))}
    </div>
  );
}

export default FriendRequests;
