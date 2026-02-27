export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ user: null }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: ctx.userId } });
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    workspaceId: ctx.workspaceId,
  });
}
