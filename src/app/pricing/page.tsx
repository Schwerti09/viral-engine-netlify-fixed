import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function Plan({ name, price, desc, features, cta }: { name: string; price: string; desc: string; features: string[]; cta: string; }) {
  return (
    <Card className="bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{price}</div>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-6 w-full">
          <Link href="/register">{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Pricing() {
  return (
    <main className="min-h-screen gradient-hero">
      <div className="container py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold">← Viral-Engine</Link>
          <div className="flex gap-2">
            <Button asChild variant="secondary"><Link href="/login">Login</Link></Button>
            <Button asChild><Link href="/register">Starten</Link></Button>
          </div>
        </div>

        <h1 className="mt-10 text-4xl font-semibold tracking-tight">Preise, die nicht weh tun.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Diese Seite ist schon wired für Billing — du musst nur Stripe (oder Paddle/LemonSqueezy) anklemmen.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Plan
            name="Free"
            price="0 €"
            desc="Für’s Reinschnuppern."
            features={["3 Trend-Alerts/Woche", "Basis-Analytics (60 Tage)", "1 Projekt"]}
            cta="Gratis starten"
          />
          <Plan
            name="Creator"
            price="49 € / Monat"
            desc="Für ernsthafte Creator."
            features={["Trend-Radar (voll)", "KI-Ideen-Generator", "Analytics Historie unbegrenzt", "1 Workspace, 3 Projekte"]}
            cta="Creator werden"
          />
          <Plan
            name="Agency"
            price="199 € / Monat"
            desc="Für Teams & Kundenkonten."
            features={["Mehrere Workspaces", "Konkurrenz-Benchmarks", "Team-Kollaboration", "White-Label Reports"]}
            cta="Agency testen"
          />
        </div>
      </div>
    </main>
  );
}
