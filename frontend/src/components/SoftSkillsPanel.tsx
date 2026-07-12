import { useState } from "react";
import { Users } from "lucide-react";
import type { SoftSkillsAssessment } from "../types/analysis";

interface SoftSkillsPanelProps {
  data: SoftSkillsAssessment;
}

export default function SoftSkillsPanel({ data }: SoftSkillsPanelProps) {
  const [openTrait, setOpenTrait] = useState<number | null>(null);

  return (
    <div>
      <div className="section-title">
        <Users size={18} className="text-navy" strokeWidth={2.5} />
        <h3 className="!mb-0">Soft Skills &amp; Leadership</h3>
      </div>

      <p className="mb-5 font-sans text-sm leading-relaxed text-espresso-muted">{data.summary}</p>

      <div className="mb-5 flex flex-wrap gap-2.5">
        {data.demonstrated.map((trait, i) => {
          const open = openTrait === i;
          return (
            <button
              key={trait.trait}
              type="button"
              onClick={() => setOpenTrait(open ? null : i)}
              className={`tag-chip cursor-pointer shadow-sm ${
                open
                  ? "bg-navy text-white border-navy shadow-glow"
                  : "bg-emerald-soft text-emerald border border-emerald/20 hover:bg-emerald/10 hover:-translate-y-0.5"
              }`}
            >
              {trait.trait}
            </button>
          );
        })}
      </div>

      {openTrait !== null && (
        <div className="mb-6 rounded-xl border border-navy/20 bg-navy-soft px-5 py-4 shadow-sm animate-fadeIn">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-navy mb-2">Evidence</p>
          <p className="font-sans text-sm text-espresso font-medium leading-relaxed">
            {data.demonstrated[openTrait].evidence}
          </p>
        </div>
      )}

      {data.underrepresented.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
            Underrepresented
          </p>
          <ul className="space-y-2">
            {data.underrepresented.map((point, i) => (
              <li key={i} className="flex gap-3 font-sans text-sm text-espresso-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-beige-300" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
