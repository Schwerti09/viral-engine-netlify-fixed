export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { IdeaStudio } from "@/components/app/idea-studio";

export default async function IdeasPage() {
  const { workspaceId } = await requireAuth();

  const project = await prisma.project.findFirst({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  if (!project) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Ideas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kein Projekt vorhanden. Lege ein Projekt in der DB an.</p>
      </div>
    );
  }

  const ideas = await prisma.idea.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 30 });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Ideas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Projekt: {project.name}</p>
      </div>
      <IdeaStudio
        projectId={project.id}
        initialIdeas={ideas.map((i) => ({
          id: i.id,
          hook: i.hook,
          script: i.script,
          shotlist: i.shotlist,
          viralScore: i.viralScore,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
