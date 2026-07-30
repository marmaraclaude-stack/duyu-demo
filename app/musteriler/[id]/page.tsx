import { LeadDetailView } from "@/components/lead-detail/LeadDetailView";

export default function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <LeadDetailView leadId={params.id} />;
}
