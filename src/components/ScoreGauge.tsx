interface ScoreGaugeProps {
  score: number;
  label: string;
}

function bandColor(score: number): { ring: string; text: string } {
  if (score >= 85) return { ring: "#2E8B57", text: "#2E8B57" }; // emerald
  if (score >= 70) return { ring: "#D4AF37", text: "#B08A20" }; // gold
  if (score >= 50) return { ring: "#D4AF37", text: "#B08A20" };
  return { ring: "#E57373", text: "#E57373" }; // rose
}

export default function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const { ring, text } = bandColor(score);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-[20px] opacity-20"
          style={{ backgroundColor: ring }}
        />
        <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#EBE5D9"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={ring}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="font-display text-4xl font-bold" style={{ color: text }}>
            {score}
          </span>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-espresso-muted/60 mt-1">
            out of 100
          </span>
        </div>
      </div>
      <p
        className="mt-4 font-sans text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: text }}
      >
        {label}
      </p>
    </div>
  );
}
