interface ScoreGaugeProps {
  score: number;
  label: string;
}

function bandColor(score: number): { ring: string; text: string; bg: string } {
  if (score >= 75) {
    return { ring: "#16A34A", text: "#15803D", bg: "#F0FDF4" };
  }
  if (score >= 50) {
    return { ring: "#CA8A04", text: "#A16207", bg: "#FEFCE8" };
  }
  return { ring: "#DC2626", text: "#B91C1C", bg: "#FEF2F2" };
}

export default function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const { ring, text, bg } = bandColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="144" height="144" viewBox="0 0 144 144" className="relative z-10">
          {/* Subtle beige track */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#EFEBE2"
            strokeWidth="9"
          />
          {/* Active progress stroke */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke={ring}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 72 72)"
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="font-display text-4xl font-black text-ink tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            out of 100
          </span>
        </div>
      </div>

      <div
        className="mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
        style={{
          color: text,
          backgroundColor: bg,
          borderColor: `${ring}40`,
        }}
      >
        {label}
      </div>
    </div>
  );
}
