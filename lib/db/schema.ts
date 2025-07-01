import { relations, sql } from "drizzle-orm";
import {
  uuid,
  integer,
  pgTable,
  varchar,
  pgEnum,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const FriendState = pgEnum("friendState", [
  "PENDING",
  "FRIENDS",
  "BLOCKED",
]);

// TABLES

export const UsersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  salt: varchar("salt", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`date_trunc('minute', now())`),
});

export const FriendTable = pgTable(
  "friends",
  {
    userId: uuid("userId")
      .references(() => UsersTable.id)
      .notNull(),
    friendId: uuid("friendId")
      .references(() => UsersTable.id)
      .notNull(),
    senderId: uuid("senderId").notNull(),
    status: FriendState("status").notNull(),
    createdAt: timestamp("createdAt")
      .notNull()
      .default(sql`date_trunc('minute', now())`),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .default(sql`date_trunc('minute', now())`),
  },
  (ft) => [primaryKey({ columns: [ft.userId, ft.friendId] })]
);

export const PostsTable = pgTable("posts", {
  postId: uuid("postId").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => UsersTable.id),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").default(sql`date_trunc('minute', now())`),
  updatedAt: timestamp("updatedAt").default(sql`date_trunc('minute', now())`),
});

export const LikesTable = pgTable(
  "likes",
  {
    postId: uuid("postId").references(() => PostsTable.postId),
    userId: uuid("userId").references(() => UsersTable.id),
  },
  (lt) => [primaryKey({ columns: [lt.postId, lt.userId] })]
);

// RELATIONS

export const UserRelations = relations(UsersTable, ({ one, many }) => ({
  sender: many(FriendTable, { relationName: "sender" }),
  receiver: many(FriendTable, { relationName: "receiver" }),
  posts: many(PostsTable),
}));

export const PostRelations = relations(PostsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [PostsTable.userId],
    references: [UsersTable.id],
  }),
}));

export const FriendRelations = relations(FriendTable, ({ one }) => ({
  userA: one(UsersTable, {
    fields: [FriendTable.userId],
    references: [UsersTable.id],
    relationName: "sender",
  }),
  userB: one(UsersTable, {
    fields: [FriendTable.friendId],
    references: [UsersTable.id],
    relationName: "receiver",
  }),
}));

export const LikesRelations = relations(LikesTable, ({ one }) => ({
  post: one(PostsTable, {
    fields: [LikesTable.postId],
    references: [PostsTable.postId],
  }),
  user: one(UsersTable, {
    fields: [LikesTable.userId],
    references: [UsersTable.id],
  }),
}));
