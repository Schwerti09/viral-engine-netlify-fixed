export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateIdea } from "@/lib/ai";
import { generateIdeaSchema } from "@/lib/validators/ideas";

export async function POST(req: Request) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = generateIdeaSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Daten" }, { status: 400 });

  const { projectId, prompt } = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Projekt nicht gefunden" }, { status: 404 });

  // Ensure user is member of workspace
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: ctx.userId, workspaceId: project.workspaceId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const draft = await generateIdea(prompt, project.voice);

  const idea = await prisma.idea.create({
    data: {
      userId: ctx.userId,
      projectId: project.id,
      hook: draft.hook,
      script: draft.script,
      shotlist: draft.shotlist,
      viralScore: draft.viralScore,
    },
  });

  await prisma.auditLog
    .create({
      data: {
        workspaceId: project.workspaceId,
        userId: ctx.userId,
        action: "idea.generated",
        meta: { projectId: project.id, ideaId: idea.id },
      },
    })
    .catch(() => null);

  return NextResponse.json({
    idea: {
      id: idea.id,
      hook: idea.hook,
      script: idea.script,
      shotlist: idea.shotlist,
      viralScore: idea.viralScore,
      createdAt: idea.createdAt.toISOString(),
    },
  });
}
