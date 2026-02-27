export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeamSettings() {
  const { workspaceId } = await requireAuth();

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mitglieder</CardTitle>
          <CardDescription>Rollen: OWNER/ADMIN/MEMBER. Invite-Flow ist im Schema vorbereitet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-2xl border border-border px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{m.user.name ?? m.user.email}</div>
                  <div className="text-xs text-muted-foreground">{m.user.email}</div>
                </div>
                <Badge>{m.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
