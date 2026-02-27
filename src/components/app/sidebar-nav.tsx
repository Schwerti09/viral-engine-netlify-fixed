"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radar, Sparkles, LineChart, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/trends", label: "Trends", icon: Radar },
  { href: "/app/ideas", label: "Ideas", icon: Sparkles },
  { href: "/app/analytics", label: "Analytics", icon: LineChart },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings/profile", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1">
      {links.map((l) => {
        const Icon = l.icon;
        const active = pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
              active && "bg-muted text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
