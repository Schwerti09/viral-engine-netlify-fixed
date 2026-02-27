export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsChart from "@/components/analytics-chart";

export default async function AnalyticsPage() {
  const { workspaceId } = await requireAuth();

  const project = await prisma.project.findFirst({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  const rows = project
    ? await prisma.metricSnapshot.findMany({ where: { projectId: project.id }, orderBy: { date: "asc" }, take: 60 })
    : [];

  const data = rows.map((r) => ({
    date: r.date.toISOString().slice(5, 10),
    views: r.views,
    likes: r.likes,
    comments: r.comments,
    shares: r.shares,
    followers: r.followers,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Historie für Projekt: {project?.name ?? "—"}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Views & Likes</CardTitle>
          <CardDescription>Demo: last 60 points. Real data: ingest via API / cron.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
