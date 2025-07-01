"use client";

import { useActionState } from "react";
import { signUp } from "../lib/auth/next/actions"; // adjust path as needed

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, {
    success: false,
    message: "",
  });

  return (
    <div className=" p-10 bg-amber-100 w-full h-full flex justify-center items-center">
      <div className="w-[32em]">
        <h2 className="text-2xl mb-5">Sign up today!</h2>
        <form action={formAction}>
          <div className="flex flex-col items-center gap-2">
            <input
              name="name"
              className="border-1 rounded-sm p-2 w-full bg-white"
              placeholder="Name"
            />
            <input
              name="username"
              className="border-1 rounded-sm p-2 w-full bg-white"
              placeholder="Username"
            />
            <input
              name="email"
              className="border-1 rounded-sm p-2 w-full bg-white"
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              className="border-1 rounded-sm p-2 w-full bg-white"
              placeholder="Password"
            />
            <input
              name="confirmPassword"
              type="password"
              className="border-1 rounded-sm p-2 w-full bg-white"
              placeholder="Confirm Password"
            />
            <button
              type="submit"
              className={`ml-auto text-white font-bold rounded-md px-3 py-1 ${
                isPending ? "bg-amber-600" : "bg-amber-500"
              }`}
            >
              Sign up
            </button>
            {state.message && (
              <p
                className={`text-sm ${
                  state.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
