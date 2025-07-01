import { createClient } from "redis";
import "dotenv/config";

let redisClient = globalThis.redisClient;

if (!redisClient) {
  redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: "redis-13428.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com",
      port: 13428,
    },
  });

  redisClient.on("error", (err) => console.error("Redis Client Error", err));

  globalThis.redisClient = redisClient; // ✅ Store globally
}

let connectPromise;

export async function getRedisClient() {
  if (!redisClient.isOpen) {
    if (!connectPromise) {
      connectPromise = redisClient.connect();
    }
    await connectPromise;
  }

  return redisClient;
}
