// Supabase satırları (snake_case) ile uygulama tipleri (camelCase) arasında
// dönüştürme. PostgREST numeric kolonları string döndürdüğü için sayısal
// alanlar burada Number'a çevrilir.

import type {
  AuditLog,
  Block,
  CallRecord,
  Lead,
  LeadSource,
  LeadStatus,
  PaymentPlan,
  PrintLog,
  Reminder,
  ReminderType,
  UnitType,
} from "../types";

type Row = Record<string, unknown>;

const str = (v: unknown): string => String(v);
const optStr = (v: unknown): string | undefined =>
  v === null || v === undefined ? undefined : String(v);
const optNum = (v: unknown): number | undefined =>
  v === null || v === undefined ? undefined : Number(v);

export function rowToLead(r: Row): Lead {
  return {
    id: str(r.id),
    name: str(r.name),
    phone: str(r.phone),
    email: optStr(r.email),
    status: str(r.status) as LeadStatus,
    source: str(r.source) as LeadSource,
    block: (optStr(r.blok) as Block | undefined) ?? undefined,
    unitNo: optNum(r.unit_no),
    unitType: (optStr(r.unit_type) as UnitType | undefined) ?? undefined,
    budget: optNum(r.budget),
    assignedTo: str(r.assigned_to),
    note: optStr(r.note),
    createdAt: str(r.created_at),
    updatedAt: str(r.updated_at),
  };
}

export function leadToRow(l: Lead): Row {
  return {
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email ?? null,
    status: l.status,
    source: l.source,
    blok: l.block ?? null,
    unit_no: l.unitNo ?? null,
    unit_type: l.unitType ?? null,
    budget: l.budget ?? null,
    assigned_to: l.assignedTo,
    note: l.note ?? null,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  };
}

export function leadPatchToRow(patch: Partial<Lead>): Row {
  const row: Row = {};
  if ("name" in patch) row.name = patch.name;
  if ("phone" in patch) row.phone = patch.phone;
  if ("email" in patch) row.email = patch.email ?? null;
  if ("status" in patch) row.status = patch.status;
  if ("source" in patch) row.source = patch.source;
  if ("block" in patch) row.blok = patch.block ?? null;
  if ("unitNo" in patch) row.unit_no = patch.unitNo ?? null;
  if ("unitType" in patch) row.unit_type = patch.unitType ?? null;
  if ("budget" in patch) row.budget = patch.budget ?? null;
  if ("assignedTo" in patch) row.assigned_to = patch.assignedTo;
  if ("note" in patch) row.note = patch.note ?? null;
  return row;
}

export function rowToCall(r: Row): CallRecord {
  return {
    id: str(r.id),
    leadId: str(r.lead_id),
    agentId: str(r.agent_id),
    at: str(r.at),
    result: str(r.result) as LeadStatus,
    note: str(r.note),
    nextCallAt: optStr(r.next_call_at),
  };
}

export function callToRow(c: CallRecord): Row {
  return {
    id: c.id,
    lead_id: c.leadId,
    agent_id: c.agentId,
    at: c.at,
    result: c.result,
    note: c.note,
    next_call_at: c.nextCallAt ?? null,
  };
}

export function rowToReminder(r: Row): Reminder {
  return {
    id: str(r.id),
    leadId: str(r.lead_id),
    agentId: str(r.agent_id),
    type: str(r.type) as ReminderType,
    dueAt: str(r.due_at),
    note: optStr(r.note),
    done: Boolean(r.done),
    createdAt: str(r.created_at),
  };
}

export function reminderToRow(m: Reminder): Row {
  return {
    id: m.id,
    lead_id: m.leadId,
    agent_id: m.agentId,
    type: m.type,
    due_at: m.dueAt,
    note: m.note ?? null,
    done: m.done,
    created_at: m.createdAt,
  };
}

export function rowToPlan(r: Row): PaymentPlan {
  return {
    id: str(r.id),
    name: str(r.name),
    block: str(r.blok) as Block,
    unitType: str(r.unit_type) as UnitType,
    listPrice: Number(r.list_price),
    downPaymentPct: Number(r.down_payment_pct),
    installmentMonths: Number(r.installment_months),
    cashPrice: optNum(r.cash_price),
    highlights: Array.isArray(r.highlights) ? r.highlights.map(String) : [],
    updatedAt: str(r.updated_at),
  };
}

export function planToRow(p: PaymentPlan): Row {
  return {
    id: p.id,
    name: p.name,
    blok: p.block,
    unit_type: p.unitType,
    list_price: p.listPrice,
    down_payment_pct: p.downPaymentPct,
    installment_months: p.installmentMonths,
    cash_price: p.cashPrice ?? null,
    highlights: p.highlights,
    updated_at: p.updatedAt,
  };
}

export function planPatchToRow(patch: Partial<PaymentPlan>): Row {
  const row: Row = {};
  if ("name" in patch) row.name = patch.name;
  if ("block" in patch) row.blok = patch.block;
  if ("unitType" in patch) row.unit_type = patch.unitType;
  if ("listPrice" in patch) row.list_price = patch.listPrice;
  if ("downPaymentPct" in patch) row.down_payment_pct = patch.downPaymentPct;
  if ("installmentMonths" in patch)
    row.installment_months = patch.installmentMonths;
  if ("cashPrice" in patch) row.cash_price = patch.cashPrice ?? null;
  if ("highlights" in patch) row.highlights = patch.highlights;
  return row;
}

export function rowToPrintLog(r: Row): PrintLog {
  return {
    id: str(r.id),
    planId: str(r.plan_id),
    agentId: str(r.agent_id),
    leadId: optStr(r.lead_id),
    at: str(r.at),
  };
}

export function printLogToRow(p: PrintLog): Row {
  return {
    id: p.id,
    plan_id: p.planId,
    agent_id: p.agentId,
    lead_id: p.leadId ?? null,
    at: p.at,
  };
}

export function rowToAudit(r: Row): AuditLog {
  return {
    id: str(r.id),
    userId: str(r.user_id),
    action: str(r.action),
    target: str(r.target),
    detail: optStr(r.detail),
    at: str(r.at),
  };
}

export function auditToRow(a: AuditLog): Row {
  return {
    id: a.id,
    user_id: a.userId,
    action: a.action,
    target: a.target,
    detail: a.detail ?? null,
    at: a.at,
  };
}
