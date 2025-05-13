import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
        message:
          "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
