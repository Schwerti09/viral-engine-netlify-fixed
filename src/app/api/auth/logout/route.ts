import { NextResponse } from "next/server";
import { getAuthContext, revokeSession, clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const ctx = await getAuthContext();
  if (ctx) await revokeSession(ctx.sessionId);
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
