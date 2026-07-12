import { PenLine } from "lucide-react";
import type { ImpactAssessment as ImpactAssessmentType } from "../types/analysis";

interface ImpactAssessmentProps {
  data: ImpactAssessmentType;
}

export default function ImpactAssessment({ data }: ImpactAssessmentProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="section-title !mb-0">
          <PenLine size={18} className="text-navy" strokeWidth={2.5} />
          <h3>Impact Assessment</h3>
        </div>
        <span className="font-sans text-sm font-bold text-espresso">
          {data.impact_score}
          <span className="text-espresso-muted">/100</span>
        </span>
      </div>

      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-beige-200">
        <div
          className="h-full rounded-full bg-terracotta transition-all duration-1000"
          style={{ width: `${data.impact_score}%` }}
        />
      </div>

      <p className="mb-6 font-sans text-sm leading-relaxed text-espresso-muted">{data.summary}</p>

      <div className="space-y-4">
        {data.weak_bullets.map((bullet, i) => (
          <div key={i} className="rounded-xl border border-beige-200 bg-white/60 p-5 shadow-sm transition-all hover:shadow-md">
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
              As written
            </p>
            <p className="redline-strike mb-4 font-sans text-sm text-espresso-muted leading-relaxed">
              {bullet.original}
            </p>
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-widest text-navy">
              Rewrite
            </p>
            <p className="border-l-2 border-navy pl-4 font-sans text-sm font-medium text-espresso leading-relaxed">
              {bullet.rewrite_suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
