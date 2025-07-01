import Link from "next/link";
import React from "react";
import { signOut } from "../lib/auth/next/actions";
import { getCurrentUser } from "../lib/auth/next/currentUser";
import PostsColumn from "../components/Posts/PostsColumn";
import FriendSuggestions from "../components/FriendSuggestions/FriendSuggestions";
import FriendRequests from "../components/FriendRequests/FriendRequests";
import ActionsColumn from "../components/ActionsColumn";
import ProfileButton from "../components/ProfileButton";

async function HomePage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-amber-300 min-h-12 flex flex-row items-center z-10 shadow-sm">
        <div className="ml-4 text-lg font-bold">FakeBook</div>
        <div className="ml-auto mr-3">
          <ProfileButton user={currentUser} />
        </div>
        <button
          onClick={signOut}
          className="cursor-pointer bg-amber-100 px-2 py-1 rounded-sm mr-3"
        >
          Log Out
        </button>
      </div>
      <div className="grid grid-cols-[clamp(150px,25%,300px)_1fr_clamp(150px,25%,300px)] h-full">
        <div className="bg-red-200">
          <ActionsColumn />
        </div>
        <div className="p-4 min-w-[25em]">
          <PostsColumn />
        </div>
        <div className="bg-blue-200 flex flex-col items-center p-4">
          {/* @ts-expect-error Async Component */}
          <FriendSuggestions />
          <div className="w-full h-[1px] bg-black my-3" />
          <FriendRequests />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
