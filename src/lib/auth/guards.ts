import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthContext, refreshAuthToken } from "@/lib/auth/session";

export async function requireAuth() {
  const ctx = await getAuthContext();
  if (!ctx) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: ctx.userId } });
  if (!user) redirect("/login");

  // Determine active workspace
  let workspaceId = ctx.workspaceId;
  if (!workspaceId) {
    const membership = await prisma.workspaceMember.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });
    workspaceId = membership?.workspaceId ?? null;
    await refreshAuthToken({ ...ctx, workspaceId });
  }

  if (!workspaceId) {
    // user without workspace -> onboarding
    redirect("/app/onboarding");
  }

  const member = await prisma.workspaceMember.findUnique({ where: { userId_workspaceId: { userId: user.id, workspaceId } } });
  if (!member) {
    // token has stale workspace -> pick first
    const fallback = await prisma.workspaceMember.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });
    const newWs = fallback?.workspaceId ?? null;
    await refreshAuthToken({ ...ctx, workspaceId: newWs });
    if (!newWs) redirect("/app/onboarding");
    return requireAuth();
  }

  return { user, workspaceId, role: member.role };
}
