"use server";

import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import { getRedisClient } from "../../redis/redis";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { getUserById } from "../../db/db";
import { getRSCModuleInformation } from "next/dist/build/analysis/get-page-static-info";

const SESSION_EXPIRE_TIME = 60 * 60 * 24 * 3;

const UserSchema = z.object({
  userId: z.string().uuid(),
});

const sessionSchema = z.object({
  id: z.string(),
});

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
};

type UserResult =
  | { success: true; data: User }
  | { success: false; data: string };

export async function createUserSession(user: z.infer<typeof UserSchema>) {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();
  const redis = await getRedisClient();
  const res = await redis.set(`session:${sessionId}`, user.userId, {
    expiration: {
      type: "EX",
      value: SESSION_EXPIRE_TIME,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + SESSION_EXPIRE_TIME * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function removeUserSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) return { success: false, data: "No user session found!" };

  const redis = await getRedisClient();
  await redis.del(`session:${sessionId}`);
  cookieStore.delete("sessionId");
  return { success: true, data: null };
}

export async function getUserFromSession(): Promise<UserResult> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");
  if (!sessionId) return { success: false, data: "No user session found!" };
  const userId = await getUserSessionById(sessionId.value);
  if (!userId) return { success: false, data: "User not found!" };
  const user = await getUserById({ userId: userId });

  return { success: true, data: user[0] };
}

async function getUserSessionById(sessionId: string) {
  const redis = await getRedisClient();
  const userId = await redis.get(`session:${sessionId}`);

  return userId;
}

export async function getSessionIdFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split("; ");

  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === "sessionId") {
      return rest.join("=");
    }
  }

  return null;
}
