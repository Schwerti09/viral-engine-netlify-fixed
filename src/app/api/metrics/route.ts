export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({
    where: { workspace: { members: { some: { userId: user.id } } } },
    orderBy: { createdAt: "asc" },
  });

  const metrics = project
    ? await prisma.metricSnapshot.findMany({ where: { projectId: project.id }, orderBy: { date: "asc" } })
    : [];

  return NextResponse.json({ project, metrics });
}
