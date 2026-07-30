// Demo saati: tarih her zaman "bugün", saat sabit 14:30 kabul edilir.
// Böylece sunucu ve istemci aynı takvim günü içinde aynı değerleri üretir,
// tohum verisi de her gün "bugüne göre" taze görünür.

const ANCHOR_HOUR = 14;
const ANCHOR_MINUTE = 30;

export function demoNow(): Date {
  const d = new Date();
  d.setHours(ANCHOR_HOUR, ANCHOR_MINUTE, 0, 0);
  return d;
}

export function atTime(base: Date, hour: number, minute: number): string {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function today(hour: number, minute: number): string {
  return atTime(demoNow(), hour, minute);
}

export function daysAgo(days: number, hour: number, minute: number): string {
  const d = demoNow();
  d.setDate(d.getDate() - days);
  return atTime(d, hour, minute);
}

export function daysAhead(days: number, hour: number, minute: number): string {
  const d = demoNow();
  d.setDate(d.getDate() + days);
  return atTime(d, hour, minute);
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = demoNow();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() < demoNow().getTime();
}

export function isFuture(iso: string): boolean {
  return new Date(iso).getTime() > demoNow().getTime();
}
