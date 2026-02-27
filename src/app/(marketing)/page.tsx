import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="gradient-hero">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge className="mb-4">Viral-Engine • SaaS Starter</Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Predictive TikTok OS.
              <span className="block text-muted-foreground">Trend → Script → Draft → Analytics.</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Eine Fullstack-Plattform, die den Creator-Workflow in ein System verwandelt: Trend-Radar, KI-Ideen,
              Score-Prognosen, Reports und Team-Flow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">Kostenlos starten</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Zur App
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="ghost" size="lg">
                  Features ansehen
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              Kein Bullshit: Das ist ein echtes Repo, bereit für GitHub + Netlify.
            </div>
          </div>

          <div className="grid w-full gap-3 md:max-w-sm">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 shimmer opacity-60" />
              <CardHeader>
                <CardTitle>Warum es knallt</CardTitle>
                <CardDescription>Die Lücke: Analyse-Tools ≠ Workflow. Workflow-Tools ≠ TikTok-Depth.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Viral-Engine verbindet beides – plus prädiktive Ideas. Alles in einem sauberen Dashboard.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Built-in Starter Data</CardTitle>
                <CardDescription>Seed-Script erstellt Demo-User, Projekt, Trends & Analytics.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Features (MVP+)</h2>
          <p className="mt-2 text-muted-foreground">Alles drin, was du brauchst, um als SaaS live zu gehen.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Trend-Radar</CardTitle>
              <CardDescription>Alerts für Sound/Hashtag/Format – pro Projekt.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">DB-backed, filterbar, mit Velocity-Score.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Idea Studio</CardTitle>
              <CardDescription>Prompt → Hook, Script, Shotlist + Viral-Score.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Der KI-Adapter ist clean gekapselt: du kannst jeden Provider einklinken.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Charts, KPIs, Historie – nicht nur 60 Tage.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Demo-Daten drin, echte Daten später via API.</CardContent>
          </Card>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 rounded-3xl border border-border/60 bg-background/70 p-8 backdrop-blur md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold">1) Discover</div>
            <div className="mt-1 text-sm text-muted-foreground">Trends in deiner Nische erkennen.</div>
          </div>
          <div>
            <div className="text-sm font-semibold">2) Create</div>
            <div className="mt-1 text-sm text-muted-foreground">Ideen bauen, Score checken, Output speichern.</div>
          </div>
          <div>
            <div className="text-sm font-semibold">3) Measure</div>
            <div className="mt-1 text-sm text-muted-foreground">Performance lesen, iterieren, skalieren.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
