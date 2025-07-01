import React from "react";
import { getUserById, sendFriendRequest } from "../../lib/db/db";
import FriendRequestButton from "./FriendRequestButton";

async function FriendSuggestionCard({ userId }: { userId: string }) {
  const friend = await getUserById({ userId });
  const friendId = friend[0].id;

  return (
    <div className="bg-white w-full p-2 px-3 border-1 rounded-sm flex flex-row items-center">
      <div className="">
        <div className="font-bold mb-[-3px]">{friend[0].name}</div>
        <div className="mt-[-5px]">@{friend[0].username}</div>
      </div>
      <FriendRequestButton friendId={friendId} />
    </div>
  );
}

export default FriendSuggestionCard;
