export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const { user, workspaceId } = await requireAuth();

  const project = await prisma.project.findFirst({ where: { workspaceId }, orderBy: { createdAt: "asc" } });

  const [trends, ideas, latestMetrics] = await Promise.all([
    project
      ? prisma.trendAlert.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 6 })
      : Promise.resolve([]),
    project ? prisma.idea.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 4 }) : Promise.resolve([]),
    project
      ? prisma.metricSnapshot.findMany({ where: { projectId: project.id }, orderBy: { date: "desc" }, take: 1 })
      : Promise.resolve([]),
  ]);

  const kpi = latestMetrics[0];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Willkommen, {user.name ?? user.email}</div>
            <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
            <div className="mt-2 text-sm text-muted-foreground">
              Aktives Projekt: <span className="text-foreground">{project?.name ?? "—"}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/app/ideas">
              <Button>Neue Idee</Button>
            </Link>
            <Link href="/app/trends">
              <Button variant="secondary">Trends</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Views</CardTitle>
            <CardDescription>Letzter Snapshot</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{kpi ? kpi.views.toLocaleString("de-DE") : "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Likes</CardTitle>
            <CardDescription>Letzter Snapshot</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{kpi ? kpi.likes.toLocaleString("de-DE") : "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
            <CardDescription>Letzter Snapshot</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{kpi ? kpi.followers.toLocaleString("de-DE") : "—"}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend-Radar</CardTitle>
            <CardDescription>Neue Alerts für dieses Projekt</CardDescription>
          </CardHeader>
          <CardContent>
            {trends.length === 0 ? (
              <div className="text-sm text-muted-foreground">Noch keine Trends. Seed laufen lassen oder API anklemmen.</div>
            ) : (
              <div className="space-y-2">
                {trends.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-2xl border border-border px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{t.title}</div>
                      <div className="text-xs text-muted-foreground">{t.kind.toUpperCase()} • Region {t.region}</div>
                    </div>
                    <Badge>v {t.velocity.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Letzte Ideen</CardTitle>
            <CardDescription>Hooks + Score</CardDescription>
          </CardHeader>
          <CardContent>
            {ideas.length === 0 ? (
              <div className="text-sm text-muted-foreground">Noch keine Ideen.</div>
            ) : (
              <div className="space-y-2">
                {ideas.map((i) => (
                  <div key={i.id} className="rounded-2xl border border-border px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 truncate text-sm font-medium">{i.hook}</div>
                      <Badge>{i.viralScore}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString("de-DE")}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
