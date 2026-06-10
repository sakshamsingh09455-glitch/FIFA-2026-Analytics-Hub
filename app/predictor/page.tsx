import Link from "next/link";
import { PageHeader, Panel } from "@/components/ui";

export default function PredictorPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Removed"
        title="Predictions are disabled"
        description="You asked for live official data only, so prediction models, win probabilities, qualification chances, and simulated outcomes have been removed from the product flow."
      />
      <Panel>
        <Link href="/matches" className="inline-flex rounded-lg bg-ink px-4 py-3 text-sm font-black text-white">
          Go to official matches
        </Link>
      </Panel>
    </div>
  );
}
