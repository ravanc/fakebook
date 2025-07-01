"use client";
import React, { useState } from "react";
import Image from "next/image";

function FriendRequestButton({ friendId }: { friendId: string }) {
  const [sent, setSent] = useState(false);

  async function _sendFriendRequest() {
    try {
      const res = await fetch("/api/friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: friendId,
          action: "PENDING",
        }),
      });

      const result = await res.json();
      if (result.success) {
        console.log("Friend request sent");
        setSent(true);
      } else {
        console.error("Failed to send request");
      }
    } catch (err) {
      console.error("Request error:", err);
    }
  }

  return (
    <button
      className="flex items-center justify-center rounded-full border-1 bg-amber-100 w-[36px] h-[36px] ml-auto mr-1 cursor-pointer"
      onClick={_sendFriendRequest}
    >
      {sent ? (
        <Image
          src={"/request_sent.png"}
          alt="Request sent"
          width={20}
          height={20}
        />
      ) : (
        <Image
          src={"/add_friend.png"}
          alt="Add Friend"
          width={20}
          height={20}
          className="object-contain object-center"
        />
      )}
    </button>
  );
}

export default FriendRequestButton;
