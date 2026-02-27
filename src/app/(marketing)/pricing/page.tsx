import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Free",
    price: "0€",
    desc: "Für Testing & erstes Setup.",
    bullets: ["1 Workspace", "1 Projekt", "Trend-Radar (limitiert)", "Idea Studio (limitiert)"],
  },
  {
    name: "Creator",
    price: "49€",
    desc: "Für ernsthafte Creator.",
    bullets: ["Unlimitierte Ideen", "Analytics Historie", "Exports", "Projekt-Templates"],
  },
  {
    name: "Agency",
    price: "199€",
    desc: "Mehrere Accounts & Team-Workflows.",
    bullets: ["Multi-Projekt", "Team & Rollen", "Benchmarking", "White-Label Reports"],
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-2 text-muted-foreground">Du kannst Billing später anschließen. Das Repo ist schon vorbereitet.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.name} className={t.name === "Creator" ? "border-border/90 shadow-md" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>{t.name}</span>
                <span className="text-xl">{t.price}</span>
              </CardTitle>
              <CardDescription>{t.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {t.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/register">
                  <Button className="w-full" variant={t.name === "Agency" ? "secondary" : "default"}>
                    Start
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
