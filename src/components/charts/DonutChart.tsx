type Segment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSubtitle?: string;
};

export function DonutChart({
  segments,
  size = 180,
  thickness = 22,
  centerLabel,
  centerSubtitle,
}: Props) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#EEF2F7"
        strokeWidth={thickness}
      />
      {total > 0 &&
        segments.map((seg, i) => {
          const fraction = seg.value / total;
          const length = fraction * circumference;
          const dashArray = `${length} ${circumference - length}`;
          const dashOffset = -offset;
          offset += length;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          );
        })}
      {(centerLabel || centerSubtitle) && (
        <g>
          {centerLabel && (
            <text
              x={cx}
              y={centerSubtitle ? cy - 2 : cy + 4}
              textAnchor="middle"
              className="fill-ink-900"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              {centerLabel}
            </text>
          )}
          {centerSubtitle && (
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="fill-ink-500"
              style={{ fontSize: 11 }}
            >
              {centerSubtitle}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
