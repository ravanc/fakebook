import { NextResponse } from "next/server";
import { getUserById } from "../../../../lib/db/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await getUserById({ userId: id });

  if (post.length === 0)
    return NextResponse.json({ success: false, data: null }, { status: 500 });

  return NextResponse.json({ success: true, data: post[0] }, { status: 200 });
}
