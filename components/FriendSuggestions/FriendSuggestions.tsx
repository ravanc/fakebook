import { cookies } from "next/headers";
import React from "react";
import { getRedisClient } from "../../lib/redis/redis";
import { getFriendSuggestions, getUserById } from "../../lib/db/db";
import FriendSuggestionCard from "./FriendSuggestionCard";

async function FriendSuggestions() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");

  if (!sessionId) return { success: false, data: null };

  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId.value}`);

  if (!userId) return { success: false, data: null };

  const friendSuggestionsId = await getFriendSuggestions({ userId: userId });

  const friendSuggestionPromises = friendSuggestionsId.map(async (friend) =>
    getUserById({ userId: friend.userId })
  );

  const friendSuggestions = await Promise.all(friendSuggestionPromises);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="mb-[-0.6em] mt-[-0.4em] font-bold">
        Friend Suggestions
      </div>
      <div className="text-[10px] italic">
        Server Component with Client Component Buttons
      </div>
      {friendSuggestions.map((friend) => (
        <FriendSuggestionCard userId={friend[0].id} key={friend[0].id} />
      ))}
    </div>
  );
}

export default FriendSuggestions;
