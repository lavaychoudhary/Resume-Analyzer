import { useState } from "react";
import { Users, CheckCircle, HelpCircle } from "lucide-react";
import type { SoftSkillsAssessment } from "../types/analysis";

interface SoftSkillsPanelProps {
  data: SoftSkillsAssessment;
}

export default function SoftSkillsPanel({ data }: SoftSkillsPanelProps) {
  const [openTrait, setOpenTrait] = useState<number | null>(0);

  return (
    <div className="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
          <Users size={16} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-ink">Soft Skills & Leadership Indicators</h3>
          <p className="text-xs text-ink-muted">Detected behavioral traits and collaboration cues</p>
        </div>
      </div>

      <p className="mb-4 text-xs text-ink-muted leading-relaxed">
        {data.summary}
      </p>

      {/* Demonstrated traits */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-green-800 block mb-2">
          Demonstrated Traits (Click to inspect evidence):
        </span>
        <div className="flex flex-wrap gap-2">
          {data.demonstrated.map((trait, i) => {
            const isSelected = openTrait === i;
            return (
              <button
                key={trait.trait}
                type="button"
                onClick={() => setOpenTrait(isSelected ? null : i)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? "bg-green-600 text-white shadow-sm ring-2 ring-green-600/30"
                    : "bg-green-50 text-green-800 border border-green-200 hover:bg-green-100"
                }`}
              >
                <CheckCircle size={12} className={isSelected ? "text-white" : "text-green-600"} />
                <span>{trait.trait}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trait evidence callout */}
      {openTrait !== null && data.demonstrated[openTrait] && (
        <div className="mb-4 rounded-xl p-4 bg-green-50/70 border border-green-200 text-left animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 mb-1">
            <span>Evidence for "{data.demonstrated[openTrait].trait}"</span>
          </div>
          <p className="text-xs font-medium text-ink-light leading-relaxed">
            "{data.demonstrated[openTrait].evidence}"
          </p>
        </div>
      )}

      {/* Underrepresented traits */}
      {data.underrepresented.length > 0 && (
        <div className="pt-3 border-t border-beige-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-2 flex items-center gap-1">
            <HelpCircle size={12} />
            Recommended Soft Skills to Emphasize:
          </span>
          <div className="flex flex-wrap gap-2">
            {data.underrepresented.map((trait, i) => (
              <span
                key={i}
                className="chip-beige text-xs"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
