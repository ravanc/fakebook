import { NextResponse } from "next/server";
import { createPost, loadPostIds } from "../../../lib/db/db";
import { cookies } from "next/headers";
import { getRedisClient } from "../../../lib/redis/redis";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");

  if (!sessionId?.value) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }
  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId.value}`);

  if (!userId) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  const url = new URL(request.url);
  const rawPage = parseInt(url.searchParams.get("page") || "1", 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const posts = await loadPostIds({ userId: userId, page: page });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const req = await request.json();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");

  if (!sessionId?.value) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }
  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId.value}`);

  if (!userId) {
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  if (req.text.length > 255)
    return NextResponse.json(
      { message: "Post length exceeded!" },
      { status: 400 }
    );

  const postId = await createPost({ userId: userId, text: req.text });
  if (postId.length !== 0)
    return NextResponse.redirect(new URL("/", request.url));
}
