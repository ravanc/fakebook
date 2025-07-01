"use server";
import { signInSchema, signUpSchema } from "./schema";
import { checkIfEmailExist, getIdPasswordAndSalt, signup } from "../../db/db";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../core/passwordHasher";
import { createUserSession, removeUserSession } from "../core/sessions";
import { redirect } from "next/navigation";

export async function signIn(prevState: unknown, formData: FormData) {
  const unsafeData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { success, data } = signInSchema.safeParse(unsafeData);
  if (!success) return { success: false, message: "Unable to log in!" };

  const res = await getIdPasswordAndSalt({ email: data.email });
  if (res.length === 0)
    return { success: false, message: "Unable to find user!" };

  const [{ password, salt }] = res;

  if (
    await comparePasswords({
      hashedPassword: password,
      salt: salt,
      password: data.password,
    })
  ) {
    await createUserSession({ userId: res[0].id });
    redirect("/");
  } else {
    return { success: false, message: "Wrong password!" };
  }
}

export async function signUp(prevState: unknown, formData: FormData) {
  const unsafeData = {
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const { success, data } = signUpSchema.safeParse(unsafeData);
  if (!success) return { success: false, message: "Unable to sign up!" };
  if (await checkIfEmailExist({ email: data.email }))
    return { success: false, message: "Email already registered!" };

  const salt = generateSalt();
  const hashedPassword = await hashPassword(data.password, salt);

  const userId = await signup({
    username: data.username,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    salt: salt,
  });

  await createUserSession(userId[0]);

  redirect("/");
}

export async function signOut() {
  await removeUserSession();
  redirect("/");
}
