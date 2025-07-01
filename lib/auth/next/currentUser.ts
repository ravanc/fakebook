"use server";

import { cache } from "react";
import { getUserFromSession } from "../core/sessions";
import { redirect } from "next/navigation";

export async function _getCurrentUser() {
  const user = await getUserFromSession();
  if (!user.success) {
    console.log(user.data);
    redirect("/login");
  }

  return user.data;
}

export const getCurrentUser = cache(_getCurrentUser);
