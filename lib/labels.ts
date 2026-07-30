import type { LeadSource, LeadStatus, QueueStage, ReminderType } from "./types";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  "arandi": "Arandı",
  "cevapsiz": "Cevapsız",
  "mesgul": "Meşgul",
  "beklemede": "Beklemede",
  "tekrar-aranacak": "Tekrar Aranacak",
  "butce-asiyor": "Bütçesini Aşıyor",
  "ofise-gelecek": "Satış Ofisine Gelecek",
  "formu-dolduran": "Formu Dolduran",
  "ilgilenmiyor": "İlgilenmiyor",
};

// Renk kodlu rozetler: altın olumlu, nötr griler ara durumlar, kırmızı olumsuz.
export const STATUS_BADGE_CLASSES: Record<LeadStatus, string> = {
  "arandi": "bg-gold-50 text-gold-800 ring-gold-200",
  "cevapsiz": "bg-danger-50 text-danger-700 ring-danger-100",
  "mesgul": "bg-orange-50 text-orange-800 ring-orange-100",
  "beklemede": "bg-ink-100 text-ink-600 ring-ink-200",
  "tekrar-aranacak": "bg-sky-50 text-sky-800 ring-sky-100",
  "butce-asiyor": "bg-danger-50 text-danger-600 ring-danger-100",
  "ofise-gelecek": "bg-gold-500/15 text-gold-800 ring-gold-300",
  "formu-dolduran": "bg-ink-800 text-ink-100 ring-ink-700",
  "ilgilenmiyor": "bg-ink-100 text-ink-400 ring-ink-200",
};

export const STATUS_DOT_CLASSES: Record<LeadStatus, string> = {
  "arandi": "bg-gold-500",
  "cevapsiz": "bg-danger-500",
  "mesgul": "bg-orange-400",
  "beklemede": "bg-ink-300",
  "tekrar-aranacak": "bg-sky-400",
  "butce-asiyor": "bg-danger-600",
  "ofise-gelecek": "bg-gold-600",
  "formu-dolduran": "bg-ink-700",
  "ilgilenmiyor": "bg-ink-400",
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  "instagram-form": "Meta · Instagram form",
  "facebook-form": "Meta · Facebook form",
  "web-form": "Web sitesi formu",
  "referans": "Referans",
  "telefon": "Doğrudan telefon",
};

export const SOURCE_SHORT_LABELS: Record<LeadSource, string> = {
  "instagram-form": "Instagram",
  "facebook-form": "Facebook",
  "web-form": "Web formu",
  "referans": "Referans",
  "telefon": "Telefon",
};

export const REMINDER_TYPE_LABELS: Record<ReminderType, string> = {
  "arama": "Geri arama",
  "randevu": "Satış ofisi randevusu",
};

export const QUEUE_STAGE_LABELS: Record<QueueStage, string> = {
  "kuyrukta": "Kuyrukta",
  "kontrol": "Numara kontrolü",
  "atandi": "Temsilciye atandı",
  "mukerrer": "Mükerrer numara",
};

export const ALL_STATUSES: LeadStatus[] = [
  "arandi",
  "cevapsiz",
  "mesgul",
  "beklemede",
  "tekrar-aranacak",
  "butce-asiyor",
  "ofise-gelecek",
  "formu-dolduran",
  "ilgilenmiyor",
];

export const ALL_SOURCES: LeadSource[] = [
  "instagram-form",
  "facebook-form",
  "web-form",
  "referans",
  "telefon",
];
