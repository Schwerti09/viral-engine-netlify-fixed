export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import { createApiKeyPair } from "@/lib/api-keys";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx?.workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({ where: { workspaceId: ctx.workspaceId }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ keys });
}

export async function POST(req: Request) {
  const ctx = await getAuthContext();
  if (!ctx?.workspaceId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: ctx.userId, workspaceId: ctx.workspaceId } },
  });

  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "API Key").trim().slice(0, 60);

  const { apiKey, prefix, hash } = await createApiKeyPair();

  const created = await prisma.apiKey.create({
    data: {
      workspaceId: ctx.workspaceId,
      userId: ctx.userId,
      name,
      prefix,
      hash,
    },
  });

  await prisma.auditLog
    .create({
      data: {
        workspaceId: ctx.workspaceId,
        userId: ctx.userId,
        action: "api_key.created",
        meta: { apiKeyId: created.id, name },
      },
    })
    .catch(() => null);

  return NextResponse.json({
    plaintext: apiKey,
    key: {
      id: created.id,
      name: created.name,
      prefix: created.prefix,
      createdAt: created.createdAt.toISOString(),
      lastUsedAt: null,
      revokedAt: null,
    },
  });
}
