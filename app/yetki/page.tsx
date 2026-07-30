import { AdminOnly } from "@/components/shell/AdminOnly";
import { AuditView } from "@/components/audit/AuditView";

export default function AuditPage() {
  return (
    <AdminOnly>
      <AuditView />
    </AdminOnly>
  );
}
