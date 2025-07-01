import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email().nonempty(),
  name: z.string().nonempty(),
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export const signInSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
});
