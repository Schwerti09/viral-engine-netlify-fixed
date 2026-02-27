"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(80).optional(),
  password: z.string().min(8),
  workspaceName: z.string().min(2).max(60).optional(),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginValues) {
    setError(null);
    const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(values) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Login fehlgeschlagen");
      return;
    }
    window.location.href = "/app/dashboard";
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Willkommen zurück. Weniger Scrollen, mehr System.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Passwort" type="password" {...form.register("password")} />
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          Kein Account?{" "}
          <Link className="text-foreground underline" href="/register">
            Registrieren
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "", workspaceName: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setError(null);
    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(values) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Registrierung fehlgeschlagen");
      return;
    }
    window.location.href = "/app/dashboard";
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Account erstellen</CardTitle>
        <CardDescription>In 60 Sekunden vom Chaos zur Pipeline.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Name (optional)" {...form.register("name")} />
          <Input placeholder="Workspace (optional)" {...form.register("workspaceName")} />
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Passwort (min. 8)" type="password" {...form.register("password")} />
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
          <Button className="w-full" type="submit">
            Registrieren
          </Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          Schon dabei?{" "}
          <Link className="text-foreground underline" href="/login">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
