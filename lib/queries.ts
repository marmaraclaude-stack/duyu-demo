// Okuma katmanı: tüm seçiciler saf fonksiyondur ve state dilimleri üzerinde
// çalışır. Supabase'e geçişte bu dosyadaki imzalar korunarak gövdeler
// sorgulara (ör. supabase.from("leads")...) dönüştürülür.

import { demoNow, isPast, isToday } from "./demo-time";
import type {
  Block,
  CallRecord,
  Lead,
  LeadFilterParams,
  PaymentPlan,
  PrintLog,
  Reminder,
  Role,
  UnitType,
} from "./types";

export function visibleLeads(leads: Lead[], userId: string, role: Role): Lead[] {
  if (role === "yonetici") return leads;
  return leads.filter((l) => l.assignedTo === userId);
}

export function leadById(leads: Lead[], id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export function callsForLead(calls: CallRecord[], leadId: string): CallRecord[] {
  return calls
    .filter((c) => c.leadId === leadId)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function remindersForLead(
  reminders: Reminder[],
  leadId: string
): Reminder[] {
  return reminders
    .filter((r) => r.leadId === leadId)
    .sort((a, b) => b.dueAt.localeCompare(a.dueAt));
}

export function todayCalls(calls: CallRecord[]): CallRecord[] {
  return calls
    .filter((c) => isToday(c.at))
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function scopeReminders(
  reminders: Reminder[],
  userId: string,
  role: Role
): Reminder[] {
  if (role === "yonetici") return reminders;
  return reminders.filter((r) => r.agentId === userId);
}

export function todayReminders(reminders: Reminder[]): Reminder[] {
  return reminders
    .filter((r) => isToday(r.dueAt))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function upcomingReminders(reminders: Reminder[]): Reminder[] {
  return reminders
    .filter((r) => !r.done && !isPast(r.dueAt) && !isToday(r.dueAt))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

// Geciken: zamanı geçmiş ve tamamlanmamış hatırlatmalar
export function overdueReminders(reminders: Reminder[]): Reminder[] {
  return reminders
    .filter((r) => !r.done && isPast(r.dueAt))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function filterLeads(leads: Lead[], p: LeadFilterParams): Lead[] {
  let out = leads;
  if (p.q && p.q.trim()) {
    const q = p.q.trim().toLocaleLowerCase("tr");
    out = out.filter(
      (l) =>
        l.name.toLocaleLowerCase("tr").includes(q) ||
        l.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        (l.email ?? "").toLocaleLowerCase("tr").includes(q)
    );
  }
  if (p.status?.length) out = out.filter((l) => p.status!.includes(l.status));
  if (p.agent?.length) out = out.filter((l) => p.agent!.includes(l.assignedTo));
  if (p.block?.length)
    out = out.filter((l) => l.block && p.block!.includes(l.block));
  if (p.unitType?.length)
    out = out.filter((l) => l.unitType && p.unitType!.includes(l.unitType));
  if (p.source?.length) out = out.filter((l) => p.source!.includes(l.source));
  if (p.budgetMin !== undefined)
    out = out.filter((l) => (l.budget ?? 0) >= p.budgetMin!);
  if (p.budgetMax !== undefined)
    out = out.filter((l) => (l.budget ?? Infinity) <= p.budgetMax!);
  if (p.dateFrom)
    out = out.filter((l) => l.createdAt >= p.dateFrom!);
  if (p.dateTo) {
    const end = new Date(p.dateTo);
    end.setHours(23, 59, 59, 999);
    const endIso = end.toISOString();
    out = out.filter((l) => l.createdAt <= endIso);
  }
  return out;
}

export function plansForUnit(
  plans: PaymentPlan[],
  block?: Block,
  unitType?: UnitType
): PaymentPlan[] {
  return plans.filter(
    (p) =>
      (block === undefined || p.block === block) &&
      (unitType === undefined || p.unitType === unitType)
  );
}

export function printLogsForPlan(logs: PrintLog[], planId: string): PrintLog[] {
  return logs
    .filter((l) => l.planId === planId)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function statusCounts(leads: Lead[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const l of leads) counts[l.status] = (counts[l.status] ?? 0) + 1;
  return counts;
}

export function minutesLate(iso: string): number {
  return Math.round((demoNow().getTime() - new Date(iso).getTime()) / 60000);
}
