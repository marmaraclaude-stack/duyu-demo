import { LeadsView } from "@/components/leads/LeadsView";

export default function LeadsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return <LeadsView initialQuery={searchParams.q ?? ""} />;
}
