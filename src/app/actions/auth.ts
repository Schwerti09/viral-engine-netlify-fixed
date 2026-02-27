"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { authenticate, createUser, setSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });
  if (!parsed.success) return redirect("/login");

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return redirect("/login?error=invalid");

  setSession(user.id);
  redirect(parsed.data.next || "/app");
}

const RegisterSchema = z.object({
  name: z.string().max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerAction(formData: FormData) {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name")?.toString() || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return redirect("/register?error=invalid");

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return redirect("/login?error=exists");

  const user = await createUser(parsed.data.email, parsed.data.password, parsed.data.name);
  // Create personal workspace + project
  const ws = await prisma.workspace.create({ data: { name: `${parsed.data.name ?? "Workspace"}` } });
  await prisma.workspaceMember.create({ data: { userId: user.id, workspaceId: ws.id, role: "OWNER" } });
  await prisma.project.create({
    data: {
      workspaceId: ws.id,
      name: "Mein Projekt",
      niche: "TikTok Nische",
      voice: "klar, humorvoll, sachlich",
    },
  });

  setSession(user.id);
  redirect("/app");
}

export async function logoutAction() {
  // We can't import clearSession directly in server action because it uses cookies() which requires request context
  // So we handle logout in route handler.
  redirect("/api/logout");
}
