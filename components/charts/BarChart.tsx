// Bağımlılıksız SVG dikey çubuk grafiği (toplam + ulaşılan katmanlı)

export interface BarDatum {
  label: string;
  total: number;
  highlight: number;
}

export function BarChart({
  data,
  height = 180,
}: {
  data: BarDatum[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const barW = 100 / data.length;

  return (
    <div>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Günlük arama grafiği"
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2="100"
            y1={height - f * (height - 20)}
            y2={height - f * (height - 20)}
            stroke="#E4E4E8"
            strokeWidth="0.4"
          />
        ))}
        {data.map((d, i) => {
          const x = i * barW + barW * 0.18;
          const w = barW * 0.64;
          const hTotal = (d.total / max) * (height - 20);
          const hHi = (d.highlight / max) * (height - 20);
          return (
            <g key={i}>
              <rect
                x={x}
                y={height - hTotal}
                width={w}
                height={hTotal}
                rx="1"
                fill="#1E1E24"
                opacity="0.16"
              />
              <rect
                x={x}
                y={height - hHi}
                width={w}
                height={hHi}
                rx="1"
                fill="#C9A227"
              />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between">
        {data.map((d, i) => (
          <span
            key={i}
            className="flex-1 text-center font-mono text-[9px] text-ink-400 sm:text-[10px]"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
