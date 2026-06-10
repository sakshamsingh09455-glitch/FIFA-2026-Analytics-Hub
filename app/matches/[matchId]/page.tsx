import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Users } from "lucide-react";
import { PageHeader, Panel, StatusPill } from "@/components/ui";
import { flagUrl, formatDateTime, getOfficialMatch, getOfficialMatches, matchStatusLabel, teamName, text } from "@/lib/fifa";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const matches = await getOfficialMatches();
  return matches.map((match) => ({ matchId: match.IdMatch }));
}

function TeamBlock({ team, score }: { team: Parameters<typeof teamName>[0]; score?: number | null }) {
  const flag = flagUrl(team, 5);
  return (
    <div className="rounded-lg bg-[#f5f7f3] p-5 text-center">
      {flag ? <Image src={flag} alt="" width={52} height={52} className="mx-auto h-14 w-14 rounded-full object-cover" /> : null}
      <p className="mt-3 text-2xl font-black">{teamName(team)}</p>
      <p className="mt-2 text-5xl font-black">{score ?? "-"}</p>
      <p className="mt-1 text-sm font-bold text-ink/50">{team?.Abbreviation ?? team?.IdCountry ?? "TBD"}</p>
    </div>
  );
}

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  let match;
  try {
    match = await getOfficialMatch(matchId);
  } catch {
    notFound();
  }

  if (!match?.IdMatch) notFound();

  const status = matchStatusLabel(match);
  const officials = match.Officials ?? [];

  return (
    <div>
      <PageHeader
        eyebrow={`Official match ${match.MatchNumber} · ${text(match.GroupName, text(match.StageName))}`}
        title={`${teamName(match.Home)} vs ${teamName(match.Away)}`}
        description="Official FIFA match details including status, score fields, venue, city, officials, group/stage, and source metadata."
      />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusPill status={status} />
            <p className="flex items-center gap-2 text-sm font-bold text-ink/60">
              <CalendarClock size={16} />
              {formatDateTime(match.Date)} IST
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <TeamBlock team={match.Home} score={match.HomeTeamScore} />
            <div className="rounded-lg bg-ink px-5 py-3 text-center text-xl font-black text-white">vs</div>
            <TeamBlock team={match.Away} score={match.AwayTeamScore} />
          </div>
          {(match.HomeTeamPenaltyScore != null || match.AwayTeamPenaltyScore != null) && (
            <p className="mt-4 rounded-lg bg-sun/25 p-3 text-center text-sm font-black">
              Penalties: {match.HomeTeamPenaltyScore ?? "-"} - {match.AwayTeamPenaltyScore ?? "-"}
            </p>
          )}
        </Panel>

        <Panel>
          <h2 className="text-lg font-black">Venue</h2>
          <p className="mt-4 flex items-center gap-2 text-ink/70">
            <MapPin size={18} />
            {text(match.Stadium?.Name)}, {text(match.Stadium?.CityName)}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Stage</p><p className="font-black">{text(match.StageName)}</p></div>
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Group</p><p className="font-black">{text(match.GroupName, "Knockout")}</p></div>
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">City</p><p className="font-black">{text(match.Stadium?.CityName)}</p></div>
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Roof</p><p className="font-black">{match.Stadium?.Roof ? "Yes" : "No / unknown"}</p></div>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel>
          <h2 className="text-lg font-black">Officials</h2>
          <div className="mt-4 space-y-3">
            {officials.length ? officials.map((official) => (
              <p key={official.OfficialId} className="rounded-lg border border-ink/10 p-3 text-sm">
                <strong>{text(official.TypeLocalized, "Official")}:</strong> {text(official.NameShort ?? official.Name)} {official.IdCountry ? `(${official.IdCountry})` : ""}
              </p>
            )) : <p className="text-sm text-ink/60">FIFA has not published officials for this match yet.</p>}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-black">Match Metadata</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-lg bg-[#f5f7f3] p-3"><strong>Match ID:</strong> {match.IdMatch}</p>
            <p className="rounded-lg bg-[#f5f7f3] p-3"><strong>Competition:</strong> {text(match.CompetitionName)}</p>
            <p className="rounded-lg bg-[#f5f7f3] p-3"><strong>Season:</strong> {text(match.SeasonName)}</p>
            <p className="rounded-lg bg-[#f5f7f3] p-3"><strong>Attendance:</strong> {match.Attendance ?? "Not published"}</p>
          </div>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 text-lg font-black"><Users size={18} /> Teams</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-lg border border-pitch/15 p-3"><strong>{teamName(match.Home)}:</strong> FIFA team ID {match.Home?.IdTeam ?? "TBD"}</p>
            <p className="rounded-lg border border-coral/20 p-3"><strong>{teamName(match.Away)}:</strong> FIFA team ID {match.Away?.IdTeam ?? "TBD"}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
