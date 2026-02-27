export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx?.workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({ where: { workspaceId: ctx.workspaceId }, orderBy: { createdAt: "asc" } });
  if (!project) return NextResponse.json({ data: [] });

  const rows = await prisma.metricSnapshot.findMany({ where: { projectId: project.id }, orderBy: { date: "asc" }, take: 120 });

  return NextResponse.json({
    projectId: project.id,
    data: rows.map((r) => ({
      date: r.date.toISOString(),
      views: r.views,
      likes: r.likes,
      comments: r.comments,
      shares: r.shares,
      followers: r.followers,
    })),
  });
}
