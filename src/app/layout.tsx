import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral-Engine — TikTok KI Suite",
  description: "Trend-Radar, Ideen-Generator und Analytics — als modernes SaaS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
