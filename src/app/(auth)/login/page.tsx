import Link from "next/link";
import { LoginForm } from "@/components/app/auth-forms";

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-sm font-semibold">
          ← Viral-Engine
        </Link>
      </div>
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-10">
        <LoginForm />
      </div>
    </div>
  );
}
