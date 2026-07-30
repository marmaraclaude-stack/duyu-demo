// Rol izin matrisi: arayüzdeki tüm yetki kontrolleri bu tek kaynaktan okunur.
// Supabase tarafında karşılığı RLS politikalarıdır; gerçek girişe geçildiğinde
// bu matris politikalarla birebir eşlenir.

import type { Role } from "./types";

export type Permission =
  // Müşteri kayıtları: temsilci yalnızca kendi kayıtlarında, kapsam store'da daraltılır
  | "leads.manage"
  // Temsilci atama ve değiştirme
  | "leads.assign"
  // Ödeme planı ekleme ve düzenleme (görüntüleme + yazdırma herkese açık)
  | "plans.manage"
  // Raporlama ekranı
  | "reports.view"
  // Yetki ve kayıt izi ekranı
  | "audit.view"
  // Meta kuyruğuna demo lead düşürme
  | "queue.trigger"
  // CSV/Excel dışa aktarma (temsilcide kendi listesiyle sınırlı)
  | "export.csv";

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  yonetici: new Set<Permission>([
    "leads.manage",
    "leads.assign",
    "plans.manage",
    "reports.view",
    "audit.view",
    "queue.trigger",
    "export.csv",
  ]),
  temsilci: new Set<Permission>(["leads.manage", "export.csv"]),
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}
