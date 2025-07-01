"use client";

import React, { useActionState, useState } from "react";
import Form from "next/form";
import { signIn } from "../lib/auth/next/actions";

function LogInForm() {
  const [state, formAction, isPending] = useActionState(signIn, {
    success: false,
    message: "",
  });

  return (
    <div className="flex flex-row">
      <Form action={formAction}>
        <input
          name="email"
          className="border-1 rounded-sm py-1 px-3 bg-white"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          className="border-1 rounded-sm py-1 px-3 ml-2 bg-white"
          placeholder="Password"
        />
        <button
          type="submit"
          className={`ml-2 bg-amber-100 border-1 font-bold rounded-sm px-3 py-1 ${
            isPending ? "text-gray-500" : "text-black"
          }`}
        >
          Log In
        </button>
      </Form>
      {state.message && (
        <p
          className={`text-sm  ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}

export default LogInForm;
