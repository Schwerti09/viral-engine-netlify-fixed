import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stripe ist vorbereitet (ENV Variablen). Für echten Checkout: API Routes + Webhooks ergänzen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Im Repo: "no broken pages" – du kannst es später live verdrahten.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Tipp: In Netlify Webhooks + Environment Secrets setzen, dann <code>stripe listen</code> für lokale Tests.
        </CardContent>
      </Card>
    </div>
  );
}
