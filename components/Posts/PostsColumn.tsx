"use client";
import React, { useEffect, useState } from "react";
import Post from "./Post";

type PostObject = {
  postId: string;
};

function PostsColumn() {
  const [postsArray, setPostsArray] = useState<PostObject[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getPosts() {
      const res = await fetch(
        "/api/posts?" +
          new URLSearchParams({ page: page.toString() }).toString(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const postIdsArray = await res.json();
      setPostsArray(postIdsArray);
    }

    getPosts();
  }, [page]);

  return (
    <div className="h-full overflow-y-auto flex flex-col items-center gap-2">
      {postsArray.map((postObject) => (
        <Post postId={postObject.postId} key={postObject.postId} />
      ))}
    </div>
  );
}

export default PostsColumn;
