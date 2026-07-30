// Veri modeli: demo yerel state üzerinde çalışır, alanlar Supabase şemasına
// birebir taşınabilecek şekilde düz (flat) tutuldu.

export type Role = "yonetici" | "temsilci";

export interface User {
  id: string;
  name: string;
  role: Role;
  title: string;
  initials: string;
  phone: string;
  // Demo giriş bilgileri: tam sürümde gerçek kimlik doğrulamayla değişecek
  username: string;
  password: string;
}

export type LeadStatus =
  | "arandi"
  | "cevapsiz"
  | "mesgul"
  | "beklemede"
  | "tekrar-aranacak"
  | "butce-asiyor"
  | "ofise-gelecek"
  | "formu-dolduran"
  | "ilgilenmiyor";

export type LeadSource =
  | "instagram-form"
  | "facebook-form"
  | "web-form"
  | "referans"
  | "telefon";

export type Block = "A" | "B" | "C";
export type UnitType = "1+1" | "2+1" | "3+1";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  block?: Block;
  unitNo?: number;
  unitType?: UnitType;
  budget?: number;
  assignedTo: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallRecord {
  id: string;
  leadId: string;
  agentId: string;
  at: string;
  result: LeadStatus;
  note: string;
  nextCallAt?: string;
}

export type ReminderType = "arama" | "randevu";

export interface Reminder {
  id: string;
  leadId: string;
  agentId: string;
  type: ReminderType;
  dueAt: string;
  note?: string;
  done: boolean;
  createdAt: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  block: Block;
  unitType: UnitType;
  listPrice: number;
  downPaymentPct: number;
  installmentMonths: number;
  cashPrice?: number;
  highlights: string[];
  updatedAt: string;
}

export interface PrintLog {
  id: string;
  planId: string;
  agentId: string;
  leadId?: string;
  at: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  target: string;
  detail?: string;
  at: string;
}

export interface LeadFilterParams {
  q?: string;
  status?: LeadStatus[];
  agent?: string[];
  block?: Block[];
  unitType?: UnitType[];
  source?: LeadSource[];
  budgetMin?: number;
  budgetMax?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  params: LeadFilterParams;
}

// Meta lead kuyruğu simülasyonu
export type QueueStage = "kuyrukta" | "kontrol" | "atandi" | "mukerrer";

export interface QueueItem {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  campaign: string;
  unitType: UnitType;
  stage: QueueStage;
  assignedTo?: string;
  duplicateOf?: string;
  arrivedAt: string;
}
