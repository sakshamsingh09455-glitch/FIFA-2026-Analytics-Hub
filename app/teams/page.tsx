import Image from "next/image";
import Link from "next/link";
import { PageHeader, Panel } from "@/components/ui";
import { flagUrl, getOfficialTeams, teamName, text } from "@/lib/fifa";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await getOfficialTeams();

  return (
    <div>
      <PageHeader
        eyebrow="Official FIFA teams"
        title="All participating teams"
        description="Teams are generated from FIFA's official World Cup 2026 standings feed, with team IDs, group assignments, flags, and records."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((row) => {
          const name = text(row.TeamName ?? row.Team?.TeamName, teamName(row.Team));
          const flag = flagUrl(row.Team, 5);
          return (
            <Link key={row.IdTeam} href={`/teams/${row.IdTeam}`}>
              <Panel className="h-full transition hover:-translate-y-1 hover:border-pitch/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {flag ? <Image src={flag} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" /> : null}
                    <h2 className="mt-3 text-2xl font-black">{name}</h2>
                    <p className="text-sm font-bold text-ink/55">{text(row.Group)} · FIFA team ID {row.IdTeam}</p>
                  </div>
                  <span className="rounded-full bg-pitch/10 px-3 py-1 text-sm font-black text-pitch">{row.Points} pts</span>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-3 text-center">
                  <div className="rounded-lg bg-[#f5f7f3] p-3"><p className="text-xl font-black">{row.Played}</p><p className="text-xs text-ink/50">P</p></div>
                  <div className="rounded-lg bg-[#f5f7f3] p-3"><p className="text-xl font-black">{row.Won}</p><p className="text-xs text-ink/50">W</p></div>
                  <div className="rounded-lg bg-[#f5f7f3] p-3"><p className="text-xl font-black">{row.Drawn}</p><p className="text-xs text-ink/50">D</p></div>
                  <div className="rounded-lg bg-[#f5f7f3] p-3"><p className="text-xl font-black">{row.Lost}</p><p className="text-xs text-ink/50">L</p></div>
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
