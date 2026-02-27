import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createApiKeyPair } from "../src/lib/api-keys";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@viral.engine";
  const password = "demo1234";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo", passwordHash },
  });

  const ws = await prisma.workspace.upsert({
    where: { slug: "demo" },
    update: { name: "Demo Workspace" },
    create: { name: "Demo Workspace", slug: "demo" },
  });

  await prisma.workspaceMember.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: ws.id } },
    update: { role: "OWNER" },
    create: { userId: user.id, workspaceId: ws.id, role: "OWNER" },
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {
      name: "TikTok Lab",
      niche: "Neurowissenschaften x Esoterik (Edutainment)",
      voice: "klug, verspielt, ohne Schwurbel — mit Quellen-Reflex",
    },
    create: {
      id: "demo-project",
      workspaceId: ws.id,
      name: "TikTok Lab",
      niche: "Neurowissenschaften x Esoterik (Edutainment)",
      voice: "klug, verspielt, ohne Schwurbel — mit Quellen-Reflex",
    },
  });

  await prisma.trendAlert.createMany({
    data: [
      { userId: user.id, projectId: project.id, kind: "sound", title: "Synth-Loop 120bpm", velocity: 0.82, region: "DE" },
      { userId: user.id, projectId: project.id, kind: "hashtag", title: "#brainhack (Micro-Explainers)", velocity: 0.67, region: "DE" },
      { userId: user.id, projectId: project.id, kind: "format", title: "2-Frame Myth-Buster", velocity: 0.74, region: "DE" },
    ],
    skipDuplicates: true,
  });

  await prisma.idea.createMany({
    data: [
      {
        userId: user.id,
        projectId: project.id,
        hook: "Du glaubst, dein Gehirn speichert Erinnerungen wie Dateien? Nope.",
        script:
          "Hook (0-2s): 'Dein Gehirn ist kein USB-Stick.'\nBeweis (2-12s): Rekonstruktion, Hippocampus als Index, Fehlerquellen.\nTwist (12-18s): 'Darum fühlen sich falsche Erinnerungen echt an.'\nCTA (18-22s): 'Kommentier: Welche Erinnerung würdest du testen?'",
        shotlist:
          "1) Close-up, Textoverlay.\n2) Whiteboard-Skizze Hippocampus→Kortex.\n3) Split-screen 'Myth vs Reality'.",
        viralScore: 78,
      },
      {
        userId: user.id,
        projectId: project.id,
        hook: "Placebo ist kein 'Einbildung' — es ist Biologie mit Erwartungs-API.",
        script:
          "Hook: 'Placebo wirkt — aber anders als du denkst.'\nBody: Erwartung→Dopamin/Endorphine, Kontext, Konditionierung.\nMini-Experiment: 'Schmerzskala vor/nach Ritual'.\nCTA: 'Willst du eine Serie?'",
        shotlist: "1) Snap-Transition.\n2) Grafische Icons.\n3) Micro-Story.",
        viralScore: 71,
      },
    ],
    skipDuplicates: true,
  });

  // Metrics (last 21 days)
  const now = new Date();
  const days = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (20 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  for (const d of days) {
    const views = 2000 + Math.floor(Math.random() * 14000);
    const likes = Math.floor(views * (0.06 + Math.random() * 0.08));
    const comments = Math.floor(views * (0.006 + Math.random() * 0.012));
    const shares = Math.floor(views * (0.004 + Math.random() * 0.012));
    const followers = 5000 + Math.floor(Math.random() * 160);

    await prisma.metricSnapshot.upsert({
      where: { projectId_date: { projectId: project.id, date: d } },
      update: { views, likes, comments, shares, followers },
      create: { userId: user.id, projectId: project.id, date: d, views, likes, comments, shares, followers },
    });
  }

  // Demo API key
  const existing = await prisma.apiKey.findFirst({ where: { workspaceId: ws.id, name: "Demo Key" } });
  if (!existing) {
    const { apiKey, prefix, hash } = await createApiKeyPair();
    await prisma.apiKey.create({
      data: {
        workspaceId: ws.id,
        userId: user.id,
        name: "Demo Key",
        prefix,
        hash,
      },
    });

    console.log("\n--- DEMO API KEY (copy now, not stored in plaintext) ---\n" + apiKey + "\n");
  }

  await prisma.auditLog.create({
    data: {
      workspaceId: ws.id,
      userId: user.id,
      action: "seed.completed",
      meta: { projectId: project.id },
    },
  });

  console.log("Seed complete. Demo login:", email, password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
