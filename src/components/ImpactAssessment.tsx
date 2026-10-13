import { PenLine, ArrowRight, Sparkles } from "lucide-react";
import type { ImpactAssessment as ImpactAssessmentType } from "../types/analysis";

interface ImpactAssessmentProps {
  data: ImpactAssessmentType;
}

export default function ImpactAssessment({ data }: ImpactAssessmentProps) {
  const isHigh = data.impact_score >= 70;

  return (
    <div className="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
            <PenLine size={16} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink">Action Verbs & Impact Score</h3>
            <p className="text-xs text-ink-muted">Evaluating quantifiable achievements and recruiter appeal</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`font-display text-2xl font-black ${isHigh ? "text-green-600" : "text-beige-800"}`}>
            {data.impact_score}
          </span>
          <span className="text-xs text-ink-faint font-medium"> / 100</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-beige-100 border border-beige-200">
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-1000"
          style={{ width: `${data.impact_score}%` }}
        />
      </div>

      <p className="mb-6 text-sm text-ink-muted leading-relaxed bg-beige-25 p-3.5 rounded-lg border border-beige-200">
        {data.summary}
      </p>

      {/* Weak bullet rewrites */}
      {data.weak_bullets.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
            <Sparkles size={14} className="text-green-600" />
            ATS Impact Rewrites (Before & After)
          </p>

          {data.weak_bullets.map((bullet, i) => (
            <div key={i} className="rounded-xl border border-beige-200 overflow-hidden">
              {/* Before */}
              <div className="bg-beige-50 px-4 py-3 border-b border-beige-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint block mb-1">
                  Original Bullet in Resume
                </span>
                <p className="redline-strike text-xs text-ink-muted leading-relaxed font-sans">
                  {bullet.original}
                </p>
              </div>

              {/* After */}
              <div className="bg-green-50/60 px-4 py-3.5 flex items-start gap-3">
                <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-100 border border-green-200 text-green-700 flex items-center justify-center">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 block mb-1">
                    ATS-Optimized High-Impact Rewrite
                  </span>
                  <p className="text-xs font-semibold text-green-950 leading-relaxed font-sans">
                    {bullet.rewrite_suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
