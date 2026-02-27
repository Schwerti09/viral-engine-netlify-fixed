"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateIdea } from "@/lib/ai";

const Schema = z.object({
  projectId: z.string().min(1),
  prompt: z.string().min(3).max(240),
});

export async function createIdeaAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return;

  const parsed = Schema.safeParse({
    projectId: formData.get("projectId"),
    prompt: formData.get("prompt"),
  });
  if (!parsed.success) return;

  const project = await prisma.project.findFirst({
    where: { id: parsed.data.projectId, workspace: { members: { some: { userId: user.id } } } },
  });
  if (!project) return;

  const draft = await generateIdea(parsed.data.prompt, project.voice);

  await prisma.idea.create({
    data: {
      userId: user.id,
      projectId: project.id,
      hook: draft.hook,
      script: draft.script,
      shotlist: draft.shotlist,
      viralScore: draft.viralScore,
    },
  });

  revalidatePath("/app/ideas");
}
