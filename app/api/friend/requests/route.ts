import { NextRequest, NextResponse } from "next/server";
import { getFriendRequests } from "../../../../lib/db/db";
import { getRedisClient } from "../../../../lib/redis/redis";

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;

  if (!sessionId)
    return NextResponse.json({ success: false, data: null }, { status: 401 });

  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId}`);

  if (!userId)
    return NextResponse.json({ success: false, data: null }, { status: 401 });

  console.log("user id ", userId);

  const dbResponse = await getFriendRequests({ userId });

  const friendRequests = dbResponse.map((request) =>
    request.userId === userId ? request.senderId : request.userId
  );

  return NextResponse.json(
    { success: true, data: friendRequests },
    { status: 200 }
  );
}
