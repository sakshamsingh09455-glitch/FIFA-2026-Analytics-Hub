import Link from "next/link";
import { PageHeader, Panel } from "@/components/ui";

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Disabled"
        title="Admin editing is disabled"
        description="Official FIFA match data should not be edited locally. The app now reads from FIFA endpoints instead of manually managed mock records."
      />
      <Panel>
        <Link href="/matches" className="inline-flex rounded-lg bg-ink px-4 py-3 text-sm font-black text-white">
          View official matches
        </Link>
      </Panel>
    </div>
  );
}
