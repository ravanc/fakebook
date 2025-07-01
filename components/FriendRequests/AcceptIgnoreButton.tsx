"use client";
import React from "react";

function AcceptIgnoreButton({
  userId,
  action,
  friendRequestArray,
  setFriendRequestArray,
}: {
  userId: string;
  action: "ACCEPT" | "REJECT";
  friendRequestArray: string[];
  setFriendRequestArray: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  async function acceptHandler() {
    try {
      const res = await fetch("/api/friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: userId,
          action: "ACCEPT",
        }),
      });

      const result = await res.json();
      if (result.success) {
        console.log("Friend request sent");
        setFriendRequestArray(friendRequestArray.filter((id) => id !== userId));
      } else {
        console.error("Failed to send request");
      }
    } catch (err) {
      console.error("Request error:", err);
    }
  }

  async function rejectHandler() {
    try {
      const res = await fetch("/api/friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: userId,
          action: "REJECT",
        }),
      });

      const result = await res.json();
      if (result.success) {
        console.log("Friend request sent");
        setFriendRequestArray(friendRequestArray.filter((id) => id !== userId));
      } else {
        console.error("Failed to send request");
      }
    } catch (err) {
      console.error("Request error:", err);
    }
  }

  return action === "ACCEPT" ? (
    <button
      className="bg-green-500 text-white border-black border-b-1 p-1 px-2 flex items-center justify-center cursor-pointer"
      onClick={acceptHandler}
    >
      Accept
    </button>
  ) : (
    <button className="bg-red-400 text-white p-1 px-2 flex items-center justify-center cursor-pointer">
      Ignore
    </button>
  );
}

export default AcceptIgnoreButton;
