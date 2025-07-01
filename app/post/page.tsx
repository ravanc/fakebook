import React, { useActionState } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";
import Form from "next/form";
import { createPost } from "../../lib/db/db";
import { cookies } from "next/headers";
import { getRedisClient } from "../../lib/redis/redis";
import { Html } from "next/document";
import Image from "next/image";

// using server action short circuits having to define /api/..., which should
// mostly be used when you are trying to deal with external data

export async function _createPost(formData: FormData) {
  "use server";
  const text = formData.get("text");

  if (!text || typeof text !== "string") {
    throw new Error("Invalid post");
  }

  if (text.length > 255) {
    throw new Error("Post length exceeded!");
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");

  if (!sessionId) {
    throw new Error("Session not found!");
  }

  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId.value}`);

  if (!userId) {
    throw new Error("Session not found!");
  }

  await createPost({ userId: userId, text: text });
  redirect("/");
}

function PostPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-amber-100">
      <Link
        href={"/"}
        className="absolute top-3 left-4 text-lg flex flex-row items-center gap-2"
      >
        <Image src={"/back.svg"} alt="back" height={24} width={24} />
        Back
      </Link>

      <Form action={_createPost} className="flex flex-col">
        <textarea
          placeholder="Write your post here..."
          className="border-1 bg-white h-[24ch] w-[42ch] p-2 align-top resize-none rounded-md"
          name="text"
        />
        <button
          className="bg-amber-400 font-bold border-1 ml-auto mt-3 px-2 py-1 rounded-sm"
          type="submit"
        >
          Post
        </button>
      </Form>
    </div>
  );
}

export default PostPage;
