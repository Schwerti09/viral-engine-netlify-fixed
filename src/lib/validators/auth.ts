import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(80).optional(),
  password: z.string().min(8).max(200),
  workspaceName: z.string().min(2).max(60).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});
