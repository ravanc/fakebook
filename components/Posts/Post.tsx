import React, { useEffect, useState } from "react";
import { convertDate } from "../../lib/etc";
import Link from "next/link";

function Post({ postId }: { postId: string }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  useEffect(() => {
    async function getPost(postId: string) {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const postData = await res.json();
      setName(postData.username);
      setText(postData.text);
      setCreatedAt(postData.createdAt);
      setUpdatedAt(postData.updatedAt);
    }

    getPost(postId);
  }, []);

  return (
    <div className="bg-white w-full border-1 rounded-lg p-4">
      <div className="flex flex-row items-center">
        <div className="font-bold">{name}</div>
        <div className="text-[.6em] italic text-gray-500 ml-auto">
          {createdAt === updatedAt
            ? convertDate(createdAt)
            : `Updated: ${convertDate(updatedAt)}`}
        </div>
      </div>
      <div className="">{text}</div>
    </div>
  );
}

export default Post;
