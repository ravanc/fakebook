"use client";
import React, { useState } from "react";

import { User } from "../lib/auth/core/sessions";

function ProfileButton({ user }: { user: User }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative">
      <button
        className={`cursor-pointer ${
          opened ? "bg-[#ded3a7]" : "bg-amber-100"
        } px-2 py-1 rounded-sm`}
        onClick={() => setOpened(!opened)}
      >
        {user.username}
      </button>
      {opened && (
        <div className="absolute top-full right-0 mt- w-48 bg-white shadow-lg rounded-sm border border-gray-200">
          <ul className="py-1">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Settings
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
