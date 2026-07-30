// Kampanya dönemi toplulaştırılmış istatistikleri (PDF'teki örnek değerler).
// Lead tablosundaki 30 canlı kayıttan bağımsız, sezon toplamını temsil eder.

export interface FunnelStage {
  key: string;
  label: string;
  value: number;
}

export const FUNNEL: FunnelStage[] = [
  { key: "lead", label: "Lead", value: 1240 },
  { key: "gorusuldu", label: "Görüşüldü", value: 610 },
  { key: "randevu", label: "Randevu", value: 118 },
  { key: "satis", label: "Satış", value: 22 },
];

export interface TodayAgentStats {
  agentId: string;
  calls: number;
  reached: number;
}

export const TODAY_CALLS: TodayAgentStats[] = [
  { agentId: "u-ayse", calls: 46, reached: 33 },
  { agentId: "u-mehmet", calls: 38, reached: 25 },
  { agentId: "u-zeynep", calls: 33, reached: 22 },
];

export const TODAY_TOTAL_CALLS = TODAY_CALLS.reduce((s, a) => s + a.calls, 0);
export const TODAY_REACHED = TODAY_CALLS.reduce((s, a) => s + a.reached, 0);
export const TODAY_REACH_RATE = Math.round(
  (TODAY_REACHED / TODAY_TOTAL_CALLS) * 100
);

export interface AgentPerformance {
  agentId: string;
  calls: number;
  reached: number;
  appointments: number;
  sales: number;
}

// Seçili dönem (son 30 gün) temsilci performansı
export const AGENT_PERFORMANCE: AgentPerformance[] = [
  { agentId: "u-ayse", calls: 512, reached: 356, appointments: 41, sales: 9 },
  { agentId: "u-mehmet", calls: 468, reached: 310, appointments: 34, sales: 7 },
  { agentId: "u-zeynep", calls: 445, reached: 298, appointments: 31, sales: 6 },
];

// Son 14 günlük arama hacmi (raporlama grafiği için)
export const DAILY_CALLS: { day: number; calls: number; reached: number }[] = [
  { day: 13, calls: 96, reached: 64 },
  { day: 12, calls: 104, reached: 71 },
  { day: 11, calls: 88, reached: 57 },
  { day: 10, calls: 112, reached: 79 },
  { day: 9, calls: 98, reached: 66 },
  { day: 8, calls: 74, reached: 48 },
  { day: 7, calls: 52, reached: 36 },
  { day: 6, calls: 109, reached: 75 },
  { day: 5, calls: 101, reached: 68 },
  { day: 4, calls: 93, reached: 61 },
  { day: 3, calls: 118, reached: 83 },
  { day: 2, calls: 90, reached: 60 },
  { day: 1, calls: 84, reached: 55 },
  { day: 0, calls: 117, reached: 80 },
];
