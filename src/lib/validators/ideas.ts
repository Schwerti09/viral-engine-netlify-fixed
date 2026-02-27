import { z } from "zod";

export const generateIdeaSchema = z.object({
  projectId: z.string().min(1),
  prompt: z.string().min(3).max(800),
});
