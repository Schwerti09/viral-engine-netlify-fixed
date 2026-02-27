export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiKeysManager } from "@/components/app/api-keys-manager";

export default async function ApiKeysPage() {
  const { workspaceId } = await requireAuth();

  const keys = await prisma.apiKey.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">API Keys</p>
      </div>
      <ApiKeysManager
        initial={keys.map((k) => ({
          id: k.id,
          name: k.name,
          prefix: k.prefix,
          createdAt: k.createdAt.toISOString(),
          lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
          revokedAt: k.revokedAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
