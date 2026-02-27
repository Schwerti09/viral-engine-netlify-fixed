export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validators/auth";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Daten" }, { status: 400 });

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Login fehlgeschlagen" }, { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Login fehlgeschlagen" }, { status: 401 });

  const membership = await prisma.workspaceMember.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });
  await createSession(user.id, membership?.workspaceId ?? null);

  return NextResponse.json({ ok: true });
}
