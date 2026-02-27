"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export function ApiKeysManager({ initial }: { initial: ApiKeyRow[] }) {
  const [rows, setRows] = useState<ApiKeyRow[]>(initial);
  const [name, setName] = useState("New Key");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createKey() {
    setError(null);
    setCreatedKey(null);
    setLoading(true);
    try {
      const res = await fetch("/api/api-keys", { method: "POST", body: JSON.stringify({ name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Fehler");
      setRows((r) => [data.key, ...r]);
      setCreatedKey(data.plaintext);
    } catch (e: any) {
      setError(e?.message ?? "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Keys werden nur einmal im Klartext gezeigt. Danach existiert nur noch der SHA-256 Hash.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex-1">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Key name" />
            </div>
            <Button disabled={loading || name.trim().length < 2} onClick={createKey}>
              {loading ? "Erstelle…" : "Key erstellen"}
            </Button>
          </div>
          {createdKey ? (
            <div className="rounded-2xl border border-border bg-muted p-3 text-sm">
              <div className="text-xs text-muted-foreground">Copy now:</div>
              <div className="mt-1 font-mono text-xs break-all">{createdKey}</div>
            </div>
          ) : null}
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deine Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">Noch keine Keys.</div>
          ) : (
            <div className="space-y-2">
              {rows.map((k) => (
                <div key={k.id} className="flex items-center justify-between rounded-2xl border border-border px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{k.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Prefix: <span className="font-mono">{k.prefix}</span> • Created {new Date(k.createdAt).toLocaleString("de-DE")}
                    </div>
                  </div>
                  {k.revokedAt ? <Badge>revoked</Badge> : <Badge>active</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
