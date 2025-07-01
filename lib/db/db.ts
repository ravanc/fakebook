import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
import {
  sql as sqlDrizzle,
  eq,
  and,
  or,
  inArray,
  desc,
  notInArray,
  not,
} from "drizzle-orm";
import * as schema from "./schema";

import { faker } from "@faker-js/faker";
import { getAsset } from "node:sea";

// export const db = drizzle(process.env.DATABASE_URL!, {
//   schema: schema,
//   logger: false,
// });

import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";

import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

/*

RANDOM GENERATOR FUNCTIONS
RANDOM GENERATOR FUNCTIONS
RANDOM GENERATOR FUNCTIONS

*/

async function deleteAllTables() {
  await db.execute(sqlDrizzle`drop schema if exists public cascade`);
  await db.execute(sqlDrizzle`create schema public`);
  await db.execute(sqlDrizzle`drop schema if exists drizzle cascade`);
}

function createRandomUser() {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    salt: faker.string.alphanumeric({ length: 16 }),
  };
}

/*

LOGIN-SIGNUP LOGIC
LOGIN-SIGNUP LOGIC
LOGIN-SIGNUP LOGIC

*/

export async function checkIfEmailExist({
  email,
}: {
  email: string;
}): Promise<boolean> {
  const res = await db
    .select()
    .from(schema.UsersTable)
    .where(eq(schema.UsersTable.email, email));
  return res.length === 0 ? false : true;
}

export async function signup({
  username,
  name,
  email,
  password,
  salt,
}: {
  username: string;
  name: string;
  email: string;
  password: string;
  salt: string;
}) {
  const signup = await db
    .insert(schema.UsersTable)
    .values({
      username: username,
      name: name,
      email: email,
      password: password,
      salt: salt,
    })
    .returning({ userId: schema.UsersTable.id });
  return signup;
}

export async function getIdPasswordAndSalt({ email }: { email: string }) {
  return db
    .select({
      id: schema.UsersTable.id,
      password: schema.UsersTable.password,
      salt: schema.UsersTable.salt,
    })
    .from(schema.UsersTable)
    .where(eq(schema.UsersTable.email, email));
}

export async function emailLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const login = await db
    .select()
    .from(schema.UsersTable)
    .where(
      and(
        eq(schema.UsersTable.email, email),
        eq(schema.UsersTable.password, password)
      )
    );
  if (login.length === 0) {
    return false;
  } else {
    return true;
  }
}

export async function usernameLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const login = await db
    .select()
    .from(schema.UsersTable)
    .where(
      and(
        eq(schema.UsersTable.username, username),
        eq(schema.UsersTable.password, password)
      )
    );
  if (login.length === 0) {
    return false;
  } else {
    return true;
  }
}

export async function getUserById({ userId }: { userId: string }) {
  return db
    .select()
    .from(schema.UsersTable)
    .where(eq(schema.UsersTable.id, userId));
}

/*

USER INTERACTION LOGIC
USER INTERACTION LOGIC
USER INTERACTION LOGIC

*/

type FriendStatus = "PENDING" | "FRIENDS" | "BLOCKED";

type UserInteractionParams = {
  senderId: string;
  recipientId: string;
};

export async function sendFriendRequest({
  senderId,
  recipientId,
}: UserInteractionParams) {
  const [userA, userB] = [senderId, recipientId].sort();
  await db
    .insert(schema.FriendTable)
    .values({
      userId: userA,
      friendId: userB,
      senderId: senderId,
      status: "PENDING" as FriendStatus,
    })
    .onConflictDoNothing(); // recommended by chatgpt
}

export async function acceptFriendRequest({
  senderId,
  recipientId,
}: UserInteractionParams) {
  const [userA, userB] = [senderId, recipientId].sort();

  const request = await db
    .select()
    .from(schema.FriendTable)
    .where(
      and(
        eq(schema.FriendTable.userId, userA),
        eq(schema.FriendTable.friendId, userB)
      )
    );

  if (request.length !== 0) {
    await db
      .update(schema.FriendTable)
      .set({ status: "FRIENDS" as FriendStatus })
      .where(
        and(
          eq(schema.FriendTable.userId, userA),
          eq(schema.FriendTable.friendId, userB)
        )
      );
    return true;
  } else {
    return false;
  }
}

export async function deleteFriendRow({
  // to be used to delete friend requests and remove friends or unblock
  senderId,
  recipientId,
}: UserInteractionParams) {
  const [userA, userB] = [senderId, recipientId].sort();
  const result = await db
    .delete(schema.FriendTable)
    .where(
      and(
        eq(schema.FriendTable.userId, userA),
        eq(schema.FriendTable.friendId, userB)
      )
    )
    .returning();
  return result.length === 0 ? false : true; // ascertain success of deletion
}

export async function blockUser({
  senderId,
  recipientId,
}: UserInteractionParams) {
  const [userA, userB] = [senderId, recipientId].sort();
  await db
    .insert(schema.FriendTable)
    .values({
      userId: userA,
      friendId: userB,
      senderId: senderId,
      status: "BLOCKED" as FriendStatus,
    })
    .onConflictDoUpdate({
      target: [schema.FriendTable.userId, schema.FriendTable.friendId],
      set: {
        status: "BLOCKED" as FriendStatus,
        senderId: senderId,
      },
    });
}

export async function getFriendRequests({ userId }: { userId: string }) {
  return await db
    .select({
      userId: schema.FriendTable.userId,
      friendId: schema.FriendTable.friendId,
      senderId: schema.FriendTable.senderId,
    })
    .from(schema.FriendTable)
    .where(
      and(
        eq(schema.FriendTable.status, "PENDING"),
        and(
          or(
            eq(schema.FriendTable.userId, userId),
            eq(schema.FriendTable.friendId, userId)
          ),
          not(eq(schema.FriendTable.senderId, userId))
        )
      )
    );
}

/*

POST LOGIC
POST LOGIC
POST LOGIC

*/

export async function createPost({
  userId,
  text,
}: {
  userId: string;
  text: string;
}) {
  const post = await db
    .insert(schema.PostsTable)
    .values({ userId: userId, text: text })
    .returning({ postId: schema.PostsTable.postId });
  return post;
}

export async function getPostsFromUser({ userId }: { userId: string }) {
  const posts = await db
    .select({
      posts: schema.PostsTable.text,
      createdAt: schema.PostsTable.createdAt,
      updatedAt: schema.PostsTable.updatedAt,
    })
    .from(schema.PostsTable)
    .where(eq(schema.PostsTable.userId, userId));
  return posts;
}

export async function getPostById({ postId }: { postId: string }) {
  const post = await db
    .select({
      userId: schema.PostsTable.userId,
      username: schema.UsersTable.username,
      text: schema.PostsTable.text,
      createdAt: schema.PostsTable.createdAt,
      updatedAt: schema.PostsTable.updatedAt,
    })
    .from(schema.PostsTable)
    .leftJoin(
      schema.UsersTable,
      eq(schema.PostsTable.userId, schema.UsersTable.id)
    )
    .where(eq(schema.PostsTable.postId, postId));
  return post;
}

export async function modifyPost({
  postId,
  userId,
  updatedText,
}: {
  postId: string;
  userId: string;
  updatedText: string;
}) {
  const modification = await db
    .update(schema.PostsTable)
    .set({ text: updatedText })
    .where(
      and(
        eq(schema.PostsTable.postId, postId),
        eq(schema.PostsTable.userId, userId)
      )
    )
    .returning({ postId: schema.PostsTable.postId });
  if (modification.length === 0) {
    console.log("Invalid user or post ID!");
  } else {
    console.log(modification);
  }
}

/*

POST INTERACTION LOGIC
POST INTERACTION LOGIC
POST INTERACTION LOGIC

*/

export async function likePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  await db.insert(schema.LikesTable).values({ postId: postId, userId: userId });
}

export async function unlikePost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  await db
    .delete(schema.LikesTable)
    .where(
      and(
        eq(schema.LikesTable.postId, postId),
        eq(schema.LikesTable.userId, userId)
      )
    );
}

export async function checkIsLiked({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const isLiked = await db
    .select()
    .from(schema.LikesTable)
    .where(
      and(
        eq(schema.LikesTable.postId, postId),
        eq(schema.LikesTable.userId, userId)
      )
    );
  if (isLiked.length === 0) {
    return false;
  } else {
    return true;
  }
}

/*

PAGE LOADING LOGIC
PAGE LOADING LOGIC
PAGE LOADING LOGIC

*/

export async function getFriends({ userId }: { userId: string }) {
  const friendIds = await db
    .select({
      userId: schema.FriendTable.userId,
      friendId: schema.FriendTable.friendId,
    })
    .from(schema.FriendTable)
    .where(
      and(
        or(
          eq(schema.FriendTable.userId, userId),
          eq(schema.FriendTable.friendId, userId)
        ),
        eq(schema.FriendTable.status, "FRIENDS")
      )
    );
  const friendIdArray = friendIds.map((friendPair) =>
    friendPair.userId === userId ? friendPair.friendId : friendPair.userId
  );
  return friendIdArray;
}

export async function loadPostIds({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  const friendIds = await db
    .select({
      userId: schema.FriendTable.userId,
      friendId: schema.FriendTable.friendId,
    })
    .from(schema.FriendTable)
    .where(
      and(
        or(
          eq(schema.FriendTable.userId, userId),
          eq(schema.FriendTable.friendId, userId)
        ),
        eq(schema.FriendTable.status, "FRIENDS")
      )
    );
  const userIdSet = new Set<string>();
  friendIds.map((friendPair) => {
    userIdSet.add(friendPair.userId);
    userIdSet.add(friendPair.friendId);
  });
  const userIdArray = Array.from(userIdSet);
  userIdArray.push(userId);
  const postIds = await db
    .select({ postId: schema.PostsTable.postId })
    .from(schema.PostsTable)
    .where(inArray(schema.PostsTable.userId, userIdArray))
    .orderBy(desc(schema.PostsTable.createdAt))
    .offset((page - 1) * 10)
    .limit(10);

  return postIds;
}

export async function getFriendSuggestions({ userId }: { userId: string }) {
  const relatedList = await db
    .select({
      userId: schema.FriendTable.userId,
      friendId: schema.FriendTable.friendId,
    })
    .from(schema.FriendTable)
    .where(
      or(
        eq(schema.FriendTable.userId, userId),
        eq(schema.FriendTable.friendId, userId)
      )
    );

  const userIdSet = new Set<string>();
  relatedList.map((friendPair) => {
    userIdSet.add(friendPair.userId);
    userIdSet.add(friendPair.friendId);
  });
  const userIdArray = Array.from(userIdSet);

  return await db
    .select({ userId: schema.UsersTable.id })
    .from(schema.UsersTable)
    .where(
      and(
        notInArray(schema.UsersTable.id, userIdArray),
        not(eq(schema.UsersTable.id, userId))
      )
    )
    .orderBy(sqlDrizzle`RANDOM()`)
    .limit(5);
}

/*

MAIN FUNCTION
MAIN FUNCTION
MAIN FUNCTION

*/

async function main() {
  const start = performance.now();

  // await db.insert(schema.UsersTable).values(createRandomUser());
  // await db.insert(schema.UsersTable).values(createRandomUser());
  // await db.insert(schema.UsersTable).values(createRandomUser());
  // await db.insert(schema.UsersTable).values(createRandomUser());

  // await sendFriendRequest({
  //   senderId: "3bb9e967-4402-44a9-abb8-010ba17a4547",
  //   recipientId: "de67a6cf-8c97-4337-8f84-8410c6fe7afd",
  // });

  // await acceptFriendRequest({
  //   senderId: "de67a6cf-8c97-4337-8f84-8410c6fe7afd",
  //   recipientId: "3bb9e967-4402-44a9-abb8-010ba17a4547",
  // });

  // createPost({
  //   userId: "3bb9e967-4402-44a9-abb8-010ba17a4547",
  //   text: faker.lorem.sentence(),
  // });
  // createPost({
  //   userId: "b0e0cf39-3de1-4a3d-94e9-daea5e4add71",
  //   text: faker.lorem.sentence(),
  // });
  // createPost({
  //   userId: "d172f6a3-1df8-4123-b6de-d5d4385cfaf0",
  //   text: faker.lorem.sentence(),
  // });
  // createPost({
  //   userId: "de67a6cf-8c97-4337-8f84-8410c6fe7afd",
  //   text: faker.lorem.sentence(),
  // });
  // createPost({
  //   userId: "d172f6a3-1df8-4123-b6de-d5d4385cfaf0",
  //   text: faker.lorem.sentence(),
  // });

  // console.log(
  //   await getFriends({ userId: "3bb9e967-4402-44a9-abb8-010ba17a4547" }),
  //   " friends"
  // );
  // console.log(
  //   await loadPostIds({
  //     userId: "3bb9e967-4402-44a9-abb8-010ba17a4547",
  //     page: 0,
  //   }),
  //   " postids"
  // );
  // console.log(await getPasswordAndSalt({ email: "Jazmyn47@gmail.com" }));
  const end = performance.now();
  await sendFriendRequest({
    senderId: "8d2706c7-9c9c-43c9-95ff-93f79709f146",
    recipientId: "38f37b20-8aa4-4c7a-9d39-c6d62c7bc1a2",
  });
  await acceptFriendRequest({
    senderId: "8d2706c7-9c9c-43c9-95ff-93f79709f146",
    recipientId: "38f37b20-8aa4-4c7a-9d39-c6d62c7bc1a2",
  });
  // await deleteAllTables();
}

// main();
