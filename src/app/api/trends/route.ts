export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx?.workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({ where: { workspaceId: ctx.workspaceId }, orderBy: { createdAt: "asc" } });
  if (!project) return NextResponse.json({ trends: [] });

  const trends = await prisma.trendAlert.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ trends });
}

export async function POST(req: Request) {
  const ctx = await getAuthContext();
  if (!ctx?.workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const project = await prisma.project.findFirst({ where: { workspaceId: ctx.workspaceId }, orderBy: { createdAt: "asc" } });
  if (!project) return NextResponse.json({ error: "No project" }, { status: 400 });

  const kind = String(body?.kind ?? "sound");
  const title = String(body?.title ?? "Untitled");
  const velocity = Number(body?.velocity ?? 0.5);
  const region = String(body?.region ?? "DE");

  const t = await prisma.trendAlert.create({
    data: { userId: ctx.userId, projectId: project.id, kind, title, velocity, region },
  });

  return NextResponse.json({ trend: t });
}
