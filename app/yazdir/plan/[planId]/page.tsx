import { PlanPrintView } from "@/components/plans/PlanPrintView";

export default function PlanPrintPage({
  params,
  searchParams,
}: {
  params: { planId: string };
  searchParams: { lead?: string };
}) {
  return <PlanPrintView planId={params.planId} leadId={searchParams.lead} />;
}
