export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, refreshAuthToken } from "@/lib/auth";
import { switchWorkspaceSchema } from "@/lib/validators/workspaces";

export async function POST(req: Request) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = switchWorkspaceSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { workspaceId } = parsed.data;
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: ctx.userId, workspaceId } },
  });

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await refreshAuthToken({ ...ctx, workspaceId });

  return NextResponse.json({ ok: true });
}
