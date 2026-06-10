import Image from "next/image";
import { PageHeader, Panel } from "@/components/ui";
import { FIFA_SOURCE_URL, flagUrl, getOfficialStandings, groupStandings, teamName, text } from "@/lib/fifa";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const standings = await getOfficialStandings();
  const groups = groupStandings(standings);

  return (
    <div>
      <PageHeader
        eyebrow="Official FIFA standings"
        title="Group tables"
        description="Wins, draws, losses, goals for, goals against, goal difference, points, and positions from FIFA's official standings endpoint."
        action={{ label: "Open FIFA source", href: FIFA_SOURCE_URL }}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {Object.entries(groups).map(([group, rows]) => (
          <Panel key={group}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">{group}</h2>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">Official FIFA feed</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="text-left text-xs uppercase tracking-[0.14em] text-ink/45">
                  <tr>
                    <th className="py-3">Pos</th>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {rows.map((row) => {
                    const flag = flagUrl(row.Team, 3);
                    return (
                      <tr key={row.IdTeam}>
                        <td className="py-4 font-black">{row.Position}</td>
                        <td className="font-black">
                          <span className="flex items-center gap-2">
                            {flag ? <Image src={flag} alt="" width={22} height={22} className="h-6 w-6 rounded-full object-cover" /> : null}
                            {text(row.TeamName ?? row.Team?.TeamName, teamName(row.Team))}
                          </span>
                        </td>
                        <td>{row.Played}</td>
                        <td>{row.Won}</td>
                        <td>{row.Drawn}</td>
                        <td>{row.Lost}</td>
                        <td>{row.For}</td>
                        <td>{row.Against}</td>
                        <td>{row.GoalDifference}</td>
                        <td className="font-black">{row.Points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
