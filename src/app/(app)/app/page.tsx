export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function velocityLabel(v: number) {
  if (v >= 0.8) return "heiß";
  if (v >= 0.6) return "warm";
  return "frisch";
}

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) return null;

  const project = await prisma.project.findFirst({
    where: { workspace: { members: { some: { userId: user.id } } } },
    orderBy: { createdAt: "asc" },
  });

  const alerts = project
    ? await prisma.trendAlert.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 6 })
    : [];

  const ideas = project
    ? await prisma.idea.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 3 })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Projekt: <span className="font-medium text-foreground">{project?.name ?? "—"}</span>{" "}
          <span className="text-muted-foreground">·</span>{" "}
          Nische: <span className="font-medium text-foreground">{project?.niche ?? "—"}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend-Radar</CardTitle>
            <CardDescription>Deine neuesten Alerts (Demo-Daten). API-Adapter: /api/trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.kind} · {a.region}</div>
                </div>
                <Badge>{velocityLabel(a.velocity)} · {(a.velocity*100).toFixed(0)}%</Badge>
              </div>
            ))}
            {!alerts.length && <div className="text-sm text-muted-foreground">Keine Alerts.</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Neueste Ideen</CardTitle>
            <CardDescription>Hooks + Viral-Score. KI-Adapter: /api/ideas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {ideas.map((i) => (
              <div key={i.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{i.hook}</div>
                  <Badge>Score {i.viralScore}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{i.script}</div>
              </div>
            ))}
            {!ideas.length && <div className="text-sm text-muted-foreground">Keine Ideen.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
