import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRedisClient } from "../../../../lib/redis/redis";
import { getPostById } from "../../../../lib/db/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const post = await getPostById({ postId: id });

  if (post.length === 0) return NextResponse.json(null, { status: 500 });

  return NextResponse.json(post[0], { status: 200 });
}
