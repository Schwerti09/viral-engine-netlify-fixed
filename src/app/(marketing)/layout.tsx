import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-primary" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Viral-Engine</div>
              <div className="text-xs text-muted-foreground">Predictive TikTok OS</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="/pricing">
              Pricing
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="/#features">
              Features
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="/#workflow">
              Workflow
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register" className="hidden sm:block">
              <Button size="sm">Start free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Viral-Engine. Built for speed, not vibes.</div>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-foreground">
              App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
