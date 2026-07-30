"use client";

import { useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import { Donut } from "@/components/charts/Donut";
import { Funnel } from "@/components/charts/Funnel";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { IconDownload } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { downloadCsv } from "@/lib/csv";
import {
  AGENT_PERFORMANCE,
  DAILY_CALLS,
  FUNNEL,
} from "@/lib/data/stats";
import { formatNumber } from "@/lib/format";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/labels";
import { statusCounts } from "@/lib/queries";
import { useData } from "@/lib/store/DataProvider";
import type { LeadStatus } from "@/lib/types";

const STATUS_COLORS: Record<LeadStatus, string> = {
  "arandi": "#C9A227",
  "cevapsiz": "#C0503F",
  "mesgul": "#DA9B4E",
  "beklemede": "#9C9CA4",
  "tekrar-aranacak": "#7FA8C9",
  "butce-asiyor": "#8A3226",
  "ofise-gelecek": "#D4AF37",
  "formu-dolduran": "#1E1E24",
  "ilgilenmiyor": "#75757F",
};

type Period = "7" | "14" | "30";

const PERIOD_LABELS: Record<Period, string> = {
  "7": "Son 7 gün",
  "14": "Son 14 gün",
  "30": "Son 30 gün",
};

// Dönem daraldıkça toplulaştırılmış rakamlar oransal küçülür (demo verisi).
const PERIOD_FACTOR: Record<Period, number> = { "7": 0.24, "14": 0.47, "30": 1 };

export function ReportsView() {
  const { leads, users, logExport } = useData();
  const [period, setPeriod] = useState<Period>("30");

  const factor = PERIOD_FACTOR[period];
  const scaled = AGENT_PERFORMANCE.map((a) => ({
    ...a,
    calls: Math.round(a.calls * factor),
    reached: Math.round(a.reached * factor),
    appointments: Math.round(a.appointments * factor),
    sales: Math.round(a.sales * factor),
  }));
  const totals = scaled.reduce(
    (acc, a) => ({
      calls: acc.calls + a.calls,
      reached: acc.reached + a.reached,
      appointments: acc.appointments + a.appointments,
      sales: acc.sales + a.sales,
    }),
    { calls: 0, reached: 0, appointments: 0, sales: 0 }
  );

  const funnelData = FUNNEL.map((f) => ({
    ...f,
    value: Math.max(1, Math.round(f.value * factor)),
  }));

  const counts = statusCounts(leads);
  const donutData = ALL_STATUSES.filter((s) => (counts[s] ?? 0) > 0).map(
    (s) => ({
      label: STATUS_LABELS[s],
      value: counts[s] ?? 0,
      color: STATUS_COLORS[s],
    })
  );

  const days = Number(period);
  const dailyData = DAILY_CALLS.slice(-Math.min(days, DAILY_CALLS.length)).map(
    (d) => ({
      label: d.day === 0 ? "Bugün" : `-${d.day}g`,
      total: d.calls,
      highlight: d.reached,
    })
  );

  const agentName = (id: string) => users.find((u) => u.id === id)?.name ?? "·";

  const exportCsv = () => {
    downloadCsv(
      `duyu-crm-rapor-${period}gun.csv`,
      ["Temsilci", "Arama", "Ulaşılan", "Ulaşma oranı (%)", "Randevu", "Satış"],
      [
        ...scaled.map((a) => [
          agentName(a.agentId),
          a.calls,
          a.reached,
          Math.round((a.reached / Math.max(a.calls, 1)) * 100),
          a.appointments,
          a.sales,
        ]),
        [
          "Toplam",
          totals.calls,
          totals.reached,
          Math.round((totals.reached / Math.max(totals.calls, 1)) * 100),
          totals.appointments,
          totals.sales,
        ],
      ]
    );
    logExport(`Performans raporu (${PERIOD_LABELS[period]})`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-40 shrink-0">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label="Rapor dönemi"
          >
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <option key={p} value={p}>
                {PERIOD_LABELS[p]}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1" />
        <Button variant="secondary" onClick={exportCsv}>
          <IconDownload className="h-4 w-4" /> CSV/Excel&apos;e aktar
        </Button>
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Toplam arama", value: totals.calls },
          {
            label: "Ulaşma oranı",
            value: `%${Math.round((totals.reached / Math.max(totals.calls, 1)) * 100)}`,
          },
          { label: "Randevu", value: totals.appointments },
          { label: "Satış", value: totals.sales },
        ].map((s) => (
          <Card key={s.label} className="px-5 py-4">
            <p className="text-xs font-medium text-ink-400">{s.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink-900">
              {typeof s.value === "number" ? formatNumber(s.value) : s.value}
            </p>
            <p className="mt-1 text-[11px] text-ink-300">
              {PERIOD_LABELS[period]}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Dönüşüm hunisi"
            subtitle={`${PERIOD_LABELS[period]} · lead'den satışa`}
          />
          <div className="px-5 py-5">
            <Funnel data={funnelData} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Durum dağılımı"
            subtitle="Aktif lead havuzundaki güncel durumlar"
          />
          <div className="px-5 py-5">
            <Donut
              data={donutData}
              centerValue={formatNumber(leads.length)}
              centerLabel="aktif lead"
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Günlük arama hacmi"
          subtitle="Koyu: toplam arama · altın: ulaşılan"
        />
        <div className="px-5 py-5">
          <BarChart data={dailyData} />
        </div>
      </Card>

      {/* Temsilci performans tablosu */}
      <Card>
        <CardHeader
          title="Temsilci performansı"
          subtitle={PERIOD_LABELS[period]}
        />
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs text-ink-400">
                <th className="px-5 py-3 font-medium">Temsilci</th>
                <th className="px-4 py-3 text-right font-medium">Arama</th>
                <th className="px-4 py-3 text-right font-medium">Ulaşılan</th>
                <th className="px-4 py-3 text-right font-medium">Ulaşma oranı</th>
                <th className="px-4 py-3 text-right font-medium">Randevu</th>
                <th className="px-4 py-3 text-right font-medium">Satış</th>
                <th className="px-4 py-3 text-right font-medium">Dönüşüm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {scaled.map((a) => {
                const reach = Math.round(
                  (a.reached / Math.max(a.calls, 1)) * 100
                );
                const conv = ((a.sales / Math.max(a.calls, 1)) * 100).toFixed(1);
                return (
                  <tr key={a.agentId}>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2.5 font-medium text-ink-900">
                        <Avatar name={agentName(a.agentId)} size="sm" />
                        {agentName(a.agentId)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-ink-900">
                      {formatNumber(a.calls)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-ink-700">
                      {formatNumber(a.reached)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100">
                          <span
                            className="block h-full rounded-full bg-gold-500"
                            style={{ width: `${reach}%` }}
                          />
                        </span>
                        <span className="font-mono text-ink-900">%{reach}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-ink-700">
                      {formatNumber(a.appointments)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-gold-700">
                      {formatNumber(a.sales)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-ink-700">
                      %{conv.replace(".", ",")}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-ink-50/60 font-medium">
                <td className="px-5 py-3 text-ink-900">Toplam</td>
                <td className="px-4 py-3 text-right font-mono text-ink-900">
                  {formatNumber(totals.calls)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-900">
                  {formatNumber(totals.reached)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-900">
                  %{Math.round((totals.reached / Math.max(totals.calls, 1)) * 100)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-900">
                  {formatNumber(totals.appointments)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-900">
                  {formatNumber(totals.sales)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-900">
                  %
                  {((totals.sales / Math.max(totals.calls, 1)) * 100)
                    .toFixed(1)
                    .replace(".", ",")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
