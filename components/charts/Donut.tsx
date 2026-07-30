// Bağımlılıksız SVG halka grafiği

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export function Donut({
  data,
  centerLabel,
  centerValue,
}: {
  data: DonutDatum[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 40;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="#F4F4F6"
            strokeWidth="12"
          />
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * C;
            const el = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        {centerValue ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-semibold text-ink-900">
              {centerValue}
            </span>
            <span className="text-[11px] text-ink-400">{centerLabel}</span>
          </div>
        ) : null}
      </div>
      <ul className="grid w-full flex-1 grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="flex-1 text-ink-500">{d.label}</span>
            <span className="font-mono font-medium text-ink-900">
              {d.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
