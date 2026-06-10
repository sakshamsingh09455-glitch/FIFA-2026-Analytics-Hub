import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Radio, RefreshCw, Trophy } from "lucide-react";
import { OfficialMatchCard } from "@/components/official-match-card";
import { MetricCard, Panel, StatusPill } from "@/components/ui";
import { FIFA_SOURCE_URL, formatDateTime, getOfficialMatches, getOfficialStandings, matchStatusLabel, teamName, text } from "@/lib/fifa";

export const dynamic = "force-dynamic";

const kickoff = new Date("2026-06-11T19:00:00Z");

export default async function Home() {
  const [matches, standings] = await Promise.all([getOfficialMatches(), getOfficialStandings()]);
  const now = Date.now();
  const liveMatches = matches.filter((match) => matchStatusLabel(match) === "Live");
  const nextMatches = matches.filter((match) => new Date(match.Date).getTime() >= now).slice(0, 6);
  const featured = liveMatches[0] ?? nextMatches[0] ?? matches[0];
  const daysToKickoff = Math.max(0, Math.ceil((kickoff.getTime() - now) / 86_400_000));
  const teams = new Set(standings.map((row) => row.IdTeam));
  const cities = new Set(matches.map((match) => text(match.Stadium?.CityName)).filter(Boolean));

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg bg-ink text-white shadow-panel">
        <Image
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1800&q=80"
          alt="Football stadium with players on the pitch"
          fill
          priority
          className="object-cover opacity-42"
        />
        <div className="field-grid absolute inset-0" />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="flex min-h-[360px] flex-col justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] backdrop-blur">
                <RefreshCw size={14} />
                Official FIFA data · refreshes every 60s
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">
                FIFA World Cup 2026 official matches, scores, standings, venues, and officials.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/82">
                This hub uses FIFA’s official calendar, standings, and bracket endpoints. No predictions, no mock match data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/matches" className="inline-flex items-center gap-2 rounded-lg bg-sun px-4 py-3 text-sm font-black text-ink">
                View all 104 matches
                <ArrowUpRight size={16} />
              </Link>
              <a href={FIFA_SOURCE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-3 text-sm font-black text-white backdrop-blur">
                FIFA source
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="grid content-end gap-3">
            <div className="rounded-lg bg-white/14 p-5 backdrop-blur">
              <p className="text-sm font-bold text-white/70">Countdown to opening match</p>
              <p className="mt-2 text-6xl font-black">{daysToKickoff}</p>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sun">days</p>
            </div>
            <div className="rounded-lg bg-white/14 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-black">
                  <Radio size={16} />
                  {liveMatches.length ? "Live now" : "Next official match"}
                </p>
                <StatusPill status={matchStatusLabel(featured)} />
              </div>
              <p className="mt-4 text-2xl font-black">{teamName(featured.Home)} vs {teamName(featured.Away)}</p>
              <p className="mt-1 text-sm text-white/72">{formatDateTime(featured.Date)} IST</p>
              <p className="mt-1 text-sm text-white/72">{text(featured.Stadium?.Name)}, {text(featured.Stadium?.CityName)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Official Matches" value={String(matches.length)} delta="FIFA calendar feed" />
        <MetricCard label="Teams" value={String(teams.size)} delta="Official standings feed" tone="blue" />
        <MetricCard label="Host Cities" value={String(cities.size)} delta="Venue metadata" tone="coral" />
        <MetricCard label="Live Matches" value={String(liveMatches.length)} delta="Status from FIFA" tone="sun" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Next Fixtures</h2>
            <CalendarDays size={18} className="text-pitch" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {nextMatches.slice(0, 4).map((match) => <OfficialMatchCard key={match.IdMatch} match={match} />)}
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black">Opening Match Details</h2>
            <Trophy size={18} className="text-pitch" />
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <p className="rounded-lg bg-[#f5f7f3] p-4"><strong>Match:</strong> {teamName(matches[0].Home)} vs {teamName(matches[0].Away)}</p>
            <p className="rounded-lg bg-[#f5f7f3] p-4"><strong>Kick-off:</strong> {formatDateTime(matches[0].Date)} IST</p>
            <p className="rounded-lg bg-[#f5f7f3] p-4"><strong>Venue:</strong> {text(matches[0].Stadium?.Name)}, {text(matches[0].Stadium?.CityName)}</p>
            <p className="rounded-lg bg-[#f5f7f3] p-4"><strong>Group:</strong> {text(matches[0].GroupName)}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
