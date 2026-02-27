"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Idea = {
  id: string;
  hook: string;
  script: string;
  shotlist: string;
  viralScore: number;
  createdAt: string;
};

export function IdeaStudio({ projectId, initialIdeas }: { projectId: string; initialIdeas: Idea[] }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);

  const latest = useMemo(() => ideas[0], [ideas]);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ideas", { method: "POST", body: JSON.stringify({ projectId, prompt }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Fehler");
      setIdeas((prev) => [data.idea, ...prev]);
      setPrompt("");
    } catch (e: any) {
      setError(e?.message ?? "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Idea Studio</CardTitle>
          <CardDescription>Prompt rein, Output raus. (KI-Adapter sitzt in <code>src/lib/ai.ts</code>)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beispiel: 'Warum fühlen sich falsche Erinnerungen echt an?'"
            />
            {error ? <div className="text-sm text-destructive">{error}</div> : null}
            <Button disabled={loading || prompt.trim().length < 3} onClick={generate}>
              {loading ? "Generiere…" : "Idee generieren"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Letzte Idee</CardTitle>
          <CardDescription>Hook + Script + Shotlist + Score</CardDescription>
        </CardHeader>
        <CardContent>
          {!latest ? (
            <div className="text-sm text-muted-foreground">Noch keine Ideen.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{latest.hook}</div>
                <Badge>{latest.viralScore}</Badge>
              </div>
              <pre className="whitespace-pre-wrap rounded-2xl border border-border bg-muted p-3 text-xs text-muted-foreground">
                {latest.script}
              </pre>
              <pre className="whitespace-pre-wrap rounded-2xl border border-border bg-muted p-3 text-xs text-muted-foreground">
                {latest.shotlist}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Ideen-Historie</CardTitle>
          <CardDescription>Die letzten {ideas.length} Ideen</CardDescription>
        </CardHeader>
        <CardContent>
          {ideas.length === 0 ? (
            <div className="text-sm text-muted-foreground">Keine Ideen.</div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {ideas.map((i) => (
                <div key={i.id} className="rounded-2xl border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{i.hook}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleString("de-DE")}</div>
                    </div>
                    <Badge className="shrink-0">{i.viralScore}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
