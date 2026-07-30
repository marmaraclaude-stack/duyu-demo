import { AdminOnly } from "@/components/shell/AdminOnly";
import { ReportsView } from "@/components/reports/ReportsView";

export default function ReportsPage() {
  return (
    <AdminOnly>
      <ReportsView />
    </AdminOnly>
  );
}
