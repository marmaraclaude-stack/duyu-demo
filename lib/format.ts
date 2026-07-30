// Sunucu/istemci tutarlılığı için elle biçimlendirme (Intl yerine).

const AYLAR = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

const GUNLER = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatMoney(amount: number): string {
  const s = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${s} ₺`;
}

export function formatMoneyShort(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    const s = (Math.round(m * 10) / 10).toString().replace(".", ",");
    return `${s} M ₺`;
  }
  if (amount >= 1_000) return `${Math.round(amount / 1000)} B ₺`;
  return `${amount} ₺`;
}

export function formatNumber(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getDate())} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}

// "YYYY-MM-DD" biçimindeki salt tarih değerleri için (saat dilimi kaymasız)
export function formatDateOnly(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  return `${pad2(d)} ${AYLAR[m - 1]} ${y}`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

export function formatDayName(iso: string): string {
  return GUNLER[new Date(iso).getDay()];
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

export function relativeDay(iso: string, now: Date): string {
  const d = new Date(iso);
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(d) - startOf(now)) / 86_400_000);
  if (diffDays === 0) return "Bugün";
  if (diffDays === -1) return "Dün";
  if (diffDays === 1) return "Yarın";
  if (diffDays < 0) return `${Math.abs(diffDays)} gün önce`;
  return `${diffDays} gün sonra`;
}
