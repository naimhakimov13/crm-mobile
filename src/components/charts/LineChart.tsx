type Series = {
  name: string;
  color: string;
  points: number[];
  dashed?: boolean;
};

type Props = {
  categories: string[];
  series: Series[];
  height?: number;
  yTicks?: number;
};

export function LineChart({
  categories,
  series,
  height = 160,
  yTicks = 4,
}: Props) {
  const padding = { top: 12, right: 8, bottom: 22, left: 32 };
  const width = 320;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxValRaw = Math.max(
    1,
    ...series.flatMap((s) => s.points.map((p) => Math.abs(p)))
  );
  const maxVal = niceCeil(maxValRaw);

  const xStep =
    categories.length > 1 ? innerW / (categories.length - 1) : innerW;

  const yToPx = (v: number) =>
    padding.top + innerH - (v / maxVal) * innerH;

  const xToPx = (i: number) => padding.left + i * xStep;

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => {
    const v = (maxVal / yTicks) * i;
    return { v, y: yToPx(v) };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
    >
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={t.y}
            x2={width - padding.right}
            y2={t.y}
            stroke="#EEF2F7"
            strokeWidth={1}
          />
          <text
            x={padding.left - 6}
            y={t.y + 3}
            textAnchor="end"
            className="fill-ink-400"
            style={{ fontSize: 9 }}
          >
            {formatTick(t.v)}
          </text>
        </g>
      ))}

      {categories.map((c, i) => (
        <text
          key={c + i}
          x={xToPx(i)}
          y={height - 6}
          textAnchor="middle"
          className="fill-ink-400"
          style={{ fontSize: 9 }}
        >
          {c}
        </text>
      ))}

      {series.map((s, idx) => {
        const path = s.points
          .map(
            (p, i) => `${i === 0 ? "M" : "L"} ${xToPx(i)} ${yToPx(p)}`
          )
          .join(" ");
        return (
          <g key={idx}>
            <path
              d={path}
              fill="none"
              stroke={s.color}
              strokeWidth={1.6}
              strokeDasharray={s.dashed ? "4 3" : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.points.map((p, i) => (
              <circle
                key={i}
                cx={xToPx(i)}
                cy={yToPx(p)}
                r={2}
                fill={s.color}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function niceCeil(v: number) {
  if (v <= 1) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  let nice = 10;
  if (n <= 1) nice = 1;
  else if (n <= 2) nice = 2;
  else if (n <= 5) nice = 5;
  return nice * exp;
}

function formatTick(v: number) {
  if (v === 0) return "0";
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return v.toFixed(2);
}
