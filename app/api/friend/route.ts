import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRedisClient } from "../../../lib/redis/redis";
import {
  acceptFriendRequest,
  deleteFriendRow,
  sendFriendRequest,
} from "../../../lib/db/db";

// type FriendRequestParams =
// | {

// }

export async function POST(request: Request) {
  const req = await request.json();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");

  if (!sessionId?.value) {
    return NextResponse.json(
      { success: false, error: "No session found" },
      { status: 401 }
    );
  }
  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId.value}`);

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "No session found" },
      { status: 401 }
    );
  }

  if (req.action === "PENDING") {
    await sendFriendRequest({ senderId: userId, recipientId: req.recipientId });
    return NextResponse.json({ success: true }, { status: 200 });
  }
  if (req.action === "ACCEPT") {
    const success = await acceptFriendRequest({
      senderId: userId,
      recipientId: req.recipientId,
    });
    return success
      ? NextResponse.json({ success: true }, { status: 200 })
      : NextResponse.json({ success: false }, { status: 400 });
  }
  if (req.action === "REJECT") {
    const success = await deleteFriendRow({
      senderId: userId,
      recipientId: req.recipientId,
    });
    return success
      ? NextResponse.json({ success: true }, { status: 200 })
      : NextResponse.json({ success: false }, { status: 400 });
  }
}
