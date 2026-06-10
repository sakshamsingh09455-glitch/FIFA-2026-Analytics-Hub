import Image from "next/image";
import { notFound } from "next/navigation";
import { OfficialMatchCard } from "@/components/official-match-card";
import { PageHeader, Panel } from "@/components/ui";
import { flagUrl, getOfficialMatches, getOfficialTeams, teamName, text } from "@/lib/fifa";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const teams = await getOfficialTeams();
  return teams.map((team) => ({ teamId: team.IdTeam }));
}

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const [teams, matches] = await Promise.all([getOfficialTeams(), getOfficialMatches()]);
  const row = teams.find((team) => team.IdTeam === teamId);

  if (!row) notFound();

  const name = text(row.TeamName ?? row.Team?.TeamName, teamName(row.Team));
  const flag = flagUrl(row.Team, 5);
  const teamMatches = matches.filter((match) => match.Home?.IdTeam === teamId || match.Away?.IdTeam === teamId);

  return (
    <div>
      <PageHeader
        eyebrow={`${text(row.Group)} · FIFA team ID ${row.IdTeam}`}
        title={name}
        description="Official FIFA team page generated from standings and fixture feeds. Squad details will appear here when FIFA publishes squad endpoint data."
      />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          {flag ? <Image src={flag} alt="" width={72} height={72} className="h-20 w-20 rounded-full object-cover" /> : null}
          <h2 className="mt-4 text-3xl font-black">{name}</h2>
          <p className="mt-1 text-sm font-bold text-ink/55">{text(row.Group)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Position</p><p className="text-3xl font-black">{row.Position}</p></div>
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Points</p><p className="text-3xl font-black">{row.Points}</p></div>
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Goals For</p><p className="text-3xl font-black">{row.For}</p></div>
            <div className="rounded-lg bg-[#f5f7f3] p-4"><p className="text-xs font-bold text-ink/45">Goal Diff</p><p className="text-3xl font-black">{row.GoalDifference}</p></div>
          </div>
        </Panel>
        <section>
          <h2 className="mb-4 text-xl font-black">Official Fixtures</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {teamMatches.map((match) => <OfficialMatchCard key={match.IdMatch} match={match} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
