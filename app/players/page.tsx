import { PageHeader, Panel } from "@/components/ui";

export default function PlayersPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Player data"
        title="Awaiting official FIFA player statistics"
        description="No mock player goals, assists, xG, or form scores are shown. This page is reserved for official FIFA player-stat endpoints once populated for the tournament."
      />
      <Panel>
        <p className="leading-7 text-ink/65">
          The available official feed currently returns match calendar, standings, match details, officials, venues, and bracket data. Player statistics will be connected here only when FIFA publishes them through the official API.
        </p>
      </Panel>
    </div>
  );
}
