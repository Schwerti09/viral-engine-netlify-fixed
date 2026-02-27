import { z } from "zod";

export const switchWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
});
