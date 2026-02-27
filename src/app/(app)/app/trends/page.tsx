export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TrendsPage() {
  const { workspaceId } = await requireAuth();

  const project = await prisma.project.findFirst({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  const trends = project
    ? await prisma.trendAlert.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 50 })
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Trends</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alerts für Sound/Hashtag/Format. (Echte TikTok-Integration: Adapter in <code>api/trends</code>)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend-Radar</CardTitle>
          <CardDescription>{project ? `Projekt: ${project.name}` : "Kein Projekt"}</CardDescription>
        </CardHeader>
        <CardContent>
          {trends.length === 0 ? (
            <div className="text-sm text-muted-foreground">Keine Trends gefunden. Seed laufen lassen.</div>
          ) : (
            <div className="space-y-2">
              {trends.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-2xl border border-border px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.kind.toUpperCase()} • {new Date(t.createdAt).toLocaleString("de-DE")} • {t.region}
                    </div>
                  </div>
                  <Badge className="shrink-0">v {t.velocity.toFixed(2)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
