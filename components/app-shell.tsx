"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ListOrdered, Menu, Newspaper, ShieldCheck, Trophy, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Live Home", icon: Trophy },
  { href: "/matches", label: "Matches", icon: CalendarDays },
  { href: "/standings", label: "Standings", icon: ListOrdered },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/bracket", label: "Bracket", icon: ShieldCheck },
  { href: "/news", label: "FIFA Source", icon: Newspaper }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-ink/10 bg-white/90 px-4 py-5 backdrop-blur lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white">
            <ShieldCheck size={22} />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-pitch">FIFA 2026</span>
            <span className="block text-xl font-black">Analytics Hub</span>
          </span>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-ink/70 transition hover:bg-pitch/10 hover:text-pitch",
                  active && "bg-pitch text-white shadow-panel hover:bg-pitch hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-ink/10 bg-[#f8fbf7] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Official Feed</p>
          <p className="mt-2 text-sm text-ink/70">Fixtures, scores, standings, venues, officials, and knockout data refresh from FIFA endpoints.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white">
              <ShieldCheck size={18} />
            </span>
            FIFAlytics
          </Link>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <nav className="mt-3 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-[#f5f7f3] px-3 py-3 text-sm font-semibold"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <main className="lg:pl-72">
        <div className="mx-auto min-h-screen max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
