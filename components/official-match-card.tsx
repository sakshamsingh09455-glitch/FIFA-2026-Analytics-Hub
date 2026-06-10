import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Panel, StatusPill } from "@/components/ui";
import { FifaMatch, flagUrl, formatDateTime, matchStatusLabel, teamName, text } from "@/lib/fifa";

function TeamLine({ match, side }: { match: FifaMatch; side: "home" | "away" }) {
  const team = side === "home" ? match.Home : match.Away;
  const score = side === "home" ? match.HomeTeamScore : match.AwayTeamScore;
  const flag = flagUrl(team, 4);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f5f7f3] px-3 py-2">
      <span className="flex min-w-0 items-center gap-2 font-black">
        {flag ? <Image src={flag} alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" /> : null}
        <span className="truncate">{teamName(team)}</span>
      </span>
      <span className="text-xl font-black">{score ?? "-"}</span>
    </div>
  );
}

export function OfficialMatchCard({ match }: { match: FifaMatch }) {
  const status = matchStatusLabel(match);

  return (
    <Link href={`/matches/${match.IdMatch}`}>
      <Panel className="h-full transition hover:-translate-y-1 hover:border-pitch/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
              Match {match.MatchNumber} · {text(match.GroupName, text(match.StageName))}
            </p>
            <p className="mt-2 text-sm font-bold text-ink/55">{formatDateTime(match.Date)} IST</p>
          </div>
          <StatusPill status={status} />
        </div>
        <div className="mt-4 space-y-2">
          <TeamLine match={match} side="home" />
          <TeamLine match={match} side="away" />
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
          <MapPin size={15} />
          {text(match.Stadium?.Name)} · {text(match.Stadium?.CityName)}
        </p>
      </Panel>
    </Link>
  );
}
