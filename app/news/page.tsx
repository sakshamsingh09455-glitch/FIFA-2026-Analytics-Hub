import { ExternalLink } from "lucide-react";
import { PageHeader, Panel } from "@/components/ui";
import { FIFA_SOURCE_URL } from "@/lib/fifa";

export default function NewsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Official source"
        title="FIFA.com integration"
        description="This app now uses FIFA's official calendar, standings, match details, and bracket endpoints. Use the source link to compare against FIFA.com."
      />
      <Panel>
        <h2 className="text-xl font-black">Primary Source</h2>
        <p className="mt-3 leading-7 text-ink/65">
          Fixtures, scores, results, and upcoming match information are sourced from FIFA's official World Cup 2026 scores and fixtures page and the FIFA API used by that page.
        </p>
        <a
          href={FIFA_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-black text-white"
        >
          Open FIFA scores and fixtures
          <ExternalLink size={16} />
        </a>
      </Panel>
    </div>
  );
}
