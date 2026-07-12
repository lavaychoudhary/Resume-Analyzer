import { Check, X } from "lucide-react";
import type { StrengthOrGap } from "../types/analysis";

interface KeywordSectionProps {
  matched: string[];
  missing: string[];
}

export function KeywordSection({ matched, missing }: KeywordSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
          Matched
        </p>
        <div className="flex flex-wrap gap-2">
          {matched.map((kw) => (
            <span
              key={kw}
              className="tag-chip-emerald"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
          Missing
        </p>
        <div className="flex flex-wrap gap-2">
          {missing.map((kw) => (
            <span
              key={kw}
              className="tag-chip-rose"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PointListProps {
  title: string;
  items: StrengthOrGap[];
  variant: "strength" | "gap";
}

export function PointList({ title, items, variant }: PointListProps) {
  const isStrength = variant === "strength";
  return (
    <div>
      <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
        {title}
      </p>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4">
            <span
              className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm ${
                isStrength ? "bg-emerald-soft text-emerald" : "bg-rose-soft text-rose"
              }`}
            >
              {isStrength ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
            </span>
            <div>
              <p className="font-sans text-sm font-bold text-espresso">{item.point}</p>
              <p className="font-sans text-sm mt-0.5 text-espresso-muted leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
