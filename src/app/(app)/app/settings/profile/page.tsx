import { requireAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfileSettings() {
  const { user } = await requireAuth();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profil</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Basisdaten (Update-Flow kannst du als Server Action ergänzen)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <div className="text-muted-foreground">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Name</div>
            <div className="font-medium">{user.name ?? "—"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
