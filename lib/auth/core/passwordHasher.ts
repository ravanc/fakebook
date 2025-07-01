import crypto from "crypto";
import { db } from "../../db/db";
import { UsersTable } from "../../db/schema";

// LEARN: Usage of Promise to return the value passed into a callback function

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex").normalize());
    });
  });
}

// LEARN: a Buffer is a binary representation which allows for low-level functions like crypto to operate on strings more easily

export async function comparePasswords({
  password,
  salt,
  hashedPassword,
}: {
  password: string;
  salt: string;
  hashedPassword: string;
}) {
  return crypto.timingSafeEqual(
    Buffer.from(await hashPassword(password, salt), "hex"),
    Buffer.from(hashedPassword, "hex")
  );
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}
