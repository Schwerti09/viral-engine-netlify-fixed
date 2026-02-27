export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";
import { hashPassword, createSession } from "@/lib/auth";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Ungültige Daten" }, { status: 400 });

  const { email, password, name, workspaceName } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email existiert bereits" }, { status: 409 });

  const passwordHash = await hashPassword(password);

  // Create user + workspace in a transaction
  const wsName = workspaceName?.trim() || "My Workspace";
  let slug = slugify(wsName) || "workspace";

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email, name: name?.trim() || null, passwordHash } });

    // ensure unique slug
    let trySlug = slug;
    for (let i = 0; i < 10; i++) {
      const taken = await tx.workspace.findUnique({ where: { slug: trySlug } });
      if (!taken) break;
      trySlug = `${slug}-${i + 2}`;
    }

    const workspace = await tx.workspace.create({ data: { name: wsName, slug: trySlug } });

    await tx.workspaceMember.create({ data: { userId: user.id, workspaceId: workspace.id, role: "OWNER" } });

    await tx.project.create({
      data: {
        workspaceId: workspace.id,
        name: "TikTok Project",
        niche: "Deine Nische",
        voice: "klar, humorvoll, sachlich",
      },
    });

    return { user, workspace };
  });

  await createSession(created.user.id, created.workspace.id);

  return NextResponse.json({ ok: true });
}
