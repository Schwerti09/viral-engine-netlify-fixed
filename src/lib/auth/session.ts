import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { authCookieName, signAuthToken, verifyAuthToken } from "@/lib/auth/token";

const SESSION_DAYS = 14;

export type AuthContext = {
  userId: string;
  sessionId: string;
  workspaceId: string | null;
};

export async function createSession(userId: string, workspaceId?: string | null) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { userId, expiresAt } });

  const token = await signAuthToken(
    { sub: userId, sid: session.id, wid: workspaceId ?? undefined },
    SESSION_DAYS * 24 * 60 * 60
  );

  cookies().set(authCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return session;
}

export function clearSessionCookie() {
  cookies().set(authCookieName(), "", { path: "/", maxAge: 0 });
}

export async function revokeSession(sessionId: string) {
  await prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } }).catch(() => null);
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const token = cookies().get(authCookieName())?.value;
  if (!token) return null;

  try {
    const payload = await verifyAuthToken(token);
    if (!payload?.sub || !payload?.sid) return null;

    const session = await prisma.session.findUnique({ where: { id: payload.sid } });
    if (!session) return null;
    if (session.revokedAt) return null;
    if (session.expiresAt.getTime() < Date.now()) return null;

    return {
      userId: payload.sub,
      sessionId: payload.sid,
      workspaceId: payload.wid ?? null,
    };
  } catch {
    return null;
  }
}

export async function refreshAuthToken(context: AuthContext) {
  const token = await signAuthToken(
    { sub: context.userId, sid: context.sessionId, wid: context.workspaceId ?? undefined },
    SESSION_DAYS * 24 * 60 * 60
  );

  cookies().set(authCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}
