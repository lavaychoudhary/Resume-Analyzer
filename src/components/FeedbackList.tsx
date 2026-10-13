import { Check, X, CheckCircle2, AlertTriangle } from "lucide-react";
import type { StrengthOrGap } from "../types/analysis";

interface KeywordSectionProps {
  matched: string[];
  missing: string[];
}

export function KeywordSection({ matched, missing }: KeywordSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Matched Keywords */}
      <div className="bg-beige-25 p-5 rounded-xl border border-beige-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <h4 className="font-display text-sm font-bold text-ink">
              Matched Keywords
            </h4>
          </div>
          <span className="badge-green text-xs font-bold">
            {matched.length} Found
          </span>
        </div>
        <p className="text-xs text-ink-muted mb-3">
          Keywords found in both your resume and the job description:
        </p>
        <div className="flex flex-wrap gap-2">
          {matched.map((kw) => (
            <span key={kw} className="chip-green">
              <Check size={11} strokeWidth={3} className="text-green-600" />
              <span>{kw}</span>
            </span>
          ))}
          {matched.length === 0 && (
            <span className="text-xs text-ink-faint italic">No exact keyword matches found.</span>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-beige-25 p-5 rounded-xl border border-beige-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-beige-400" />
            <h4 className="font-display text-sm font-bold text-ink">
              Missing Keywords
            </h4>
          </div>
          <span className="badge-beige text-xs font-bold">
            {missing.length} Recommended
          </span>
        </div>
        <p className="text-xs text-ink-muted mb-3">
          High-priority ATS keywords to consider incorporating:
        </p>
        <div className="flex flex-wrap gap-2">
          {missing.map((kw) => (
            <span key={kw} className="chip-beige">
              <X size={11} strokeWidth={2.5} className="text-ink-muted" />
              <span>{kw}</span>
            </span>
          ))}
          {missing.length === 0 && (
            <span className="text-xs text-green-700 font-medium">Great job! All target keywords are covered.</span>
          )}
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
    <div className="bg-white p-5 rounded-xl border border-beige-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-beige-100">
        {isStrength ? (
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
        ) : (
          <AlertTriangle size={18} className="text-beige-500 shrink-0" />
        )}
        <h4 className="font-display text-sm font-bold text-ink uppercase tracking-wide">
          {title} ({items.length})
        </h4>
      </div>
      <ul className="space-y-3.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-left">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                isStrength
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-beige-150 text-ink-muted border border-beige-300"
              }`}
            >
              {isStrength ? "✓" : "!"}
            </span>
            <div>
              <p className="font-sans text-sm font-bold text-ink leading-snug">{item.point}</p>
              <p className="font-sans text-xs mt-1 text-ink-muted leading-relaxed">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
