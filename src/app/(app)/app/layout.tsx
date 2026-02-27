export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { SidebarNav } from "@/components/app/sidebar-nav";
import { LogoutButton } from "@/components/app/logout-button";
import { WorkspaceSwitcher } from "@/components/app/workspace-switcher";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, workspaceId } = await requireAuth();

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });

  const options = memberships.map((m) => ({ id: m.workspaceId, name: m.workspace.name }));

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-4 shadow-sm md:sticky md:top-6 md:h-[calc(100vh-48px)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-primary" />
              <div>
                <div className="text-sm font-semibold">Viral-Engine</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <WorkspaceSwitcher currentId={workspaceId} options={options} />
          </div>

          <SidebarNav />

          <div className="mt-6">
            <LogoutButton />
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
