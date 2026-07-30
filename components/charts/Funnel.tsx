// Bağımlılıksız SVG dönüşüm hunisi

import { formatNumber } from "@/lib/format";

export interface FunnelDatum {
  label: string;
  value: number;
}

const BAR_COLORS = ["#1E1E24", "#3B3B45", "#C9A227", "#D4AF37"];

export function Funnel({ data }: { data: FunnelDatum[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const conv =
          i === 0 ? null : Math.round((d.value / data[i - 1].value) * 100);
        return (
          <div key={d.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-ink-500">
                {d.label}
              </span>
              <span className="tabular text-sm font-semibold text-ink-900">
                {formatNumber(d.value)}
                {conv !== null ? (
                  <span className="ml-2 font-sans text-[11px] font-normal text-ink-400">
                    önceki adımın %{conv}&apos;i
                  </span>
                ) : null}
              </span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-md bg-ink-50">
              <div
                className="flex h-full items-center rounded-md transition-all"
                style={{
                  width: `${Math.max(pct, 4)}%`,
                  backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
