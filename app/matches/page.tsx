import { OfficialMatchCard } from "@/components/official-match-card";
import { PageHeader, Panel } from "@/components/ui";
import { FIFA_SOURCE_URL, getOfficialMatches, groupMatchesByDate } from "@/lib/fifa";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const matches = await getOfficialMatches();
  const byDate = groupMatchesByDate(matches);

  return (
    <div>
      <PageHeader
        eyebrow="Official FIFA fixtures"
        title="All FIFA World Cup 2026 matches"
        description="Every scheduled match from FIFA's official calendar feed, including kick-off time, teams, score fields, match status, group/stage, city, and stadium."
        action={{ label: "Open FIFA source", href: FIFA_SOURCE_URL }}
      />
      <div className="space-y-6">
        {Object.entries(byDate).map(([date, dayMatches]) => (
          <section key={date}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black">{date}</h2>
              <span className="text-sm font-bold text-ink/55">{dayMatches.length} matches</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dayMatches.map((match) => <OfficialMatchCard key={match.IdMatch} match={match} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
