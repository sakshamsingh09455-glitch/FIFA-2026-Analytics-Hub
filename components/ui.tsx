import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-coral">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal text-ink sm:text-5xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-ink/65">{description}</p>
      </div>
      {action && action.href.startsWith("http") ? (
        <a href={action.href} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white">
          {action.label}
          <ArrowUpRight size={16} />
        </a>
      ) : action ? (
        <Link href={action.href} className="inline-flex w-fit items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white">
          {action.label}
          <ArrowUpRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export function Panel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("rounded-lg border border-ink/10 bg-white p-5 shadow-panel", className)}>{children}</section>;
}

export function MetricCard({
  label,
  value,
  delta,
  tone = "green"
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "green" | "blue" | "coral" | "sun";
}) {
  const tones = {
    green: "bg-pitch/10 text-pitch",
    blue: "bg-sky/15 text-blue-700",
    coral: "bg-coral/10 text-coral",
    sun: "bg-sun/20 text-yellow-700"
  };
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-panel">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-3 text-3xl font-black text-ink">{value}</p>
      <span className={cn("mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold", tones[tone])}>{delta}</span>
    </div>
  );
}

export function ProbabilityBar({
  home,
  draw,
  away,
  labels = ["Home", "Draw", "Away"]
}: {
  home: number;
  draw: number;
  away: number;
  labels?: [string, string, string];
}) {
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-ink/10">
        <span className="bg-pitch" style={{ width: `${home}%` }} />
        <span className="bg-sun" style={{ width: `${draw}%` }} />
        <span className="bg-coral" style={{ width: `${away}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs font-bold text-ink/60">
        <span>{labels[0]} {home}%</span>
        <span className="text-center">{labels[1]} {draw}%</span>
        <span className="text-right">{labels[2]} {away}%</span>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Live"
      ? "bg-coral text-white"
      : status === "Qualified"
        ? "bg-pitch text-white"
        : status === "Eliminated"
          ? "bg-ink/10 text-ink/55"
          : "bg-sun/30 text-yellow-800";
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em]", tone)}>{status}</span>;
}
