export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Onboarding() {
  const { user } = await requireAuth();

  const memberships = await prisma.workspaceMember.findMany({ where: { userId: user.id } });
  if (memberships.length > 0) {
    // user already has a workspace; app layout will route normally
    return (
      <div className="mx-auto max-w-2xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Ready.</CardTitle>
            <CardDescription>Du hast bereits einen Workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/dashboard">
              <Button>Zum Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <CardDescription>
            Dein Account existiert, aber noch ohne Workspace. Tipp: registrieren erstellt automatisch einen Workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Schnellste Lösung: Logout → Register neu. Oder erstelle manuell einen Workspace in der DB.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
