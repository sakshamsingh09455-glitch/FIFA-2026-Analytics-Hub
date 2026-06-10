import { OfficialMatchCard } from "@/components/official-match-card";
import { PageHeader } from "@/components/ui";
import { getOfficialBracket, text } from "@/lib/fifa";

export const dynamic = "force-dynamic";

export default async function BracketPage() {
  const stages = await getOfficialBracket();

  return (
    <div>
      <PageHeader
        eyebrow="Official FIFA bracket"
        title="Knockout stage"
        description="Round of 32 through the final from FIFA's official season bracket endpoint. Teams populate as the tournament progresses."
      />
      <div className="space-y-8">
        {stages.map((stage) => (
          <section key={stage.IdStage}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">{text(stage.Name)}</h2>
              <span className="text-sm font-bold text-ink/55">{stage.Matches?.length ?? 0} matches</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(stage.Matches ?? []).map((match) => <OfficialMatchCard key={match.IdMatch} match={match} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
