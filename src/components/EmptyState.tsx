import { FileCheck, Sparkles, Target, Zap, ShieldCheck } from "lucide-react";

interface EmptyStateProps {
  onLoadSample?: () => void;
}

export default function EmptyState({ onLoadSample }: EmptyStateProps) {
  return (
    <div className="naukri-card p-8 sm:p-12 text-center bg-white flex flex-col items-center justify-center min-h-[440px]">
      {/* Icon Badge */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center border border-green-200 shadow-sm">
          <FileCheck size={32} strokeWidth={1.75} />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs shadow-sm">
          <Sparkles size={13} />
        </div>
      </div>

      <h3 className="font-display text-xl font-bold text-ink mb-2">
        Ready for ATS Compatibility Scan
      </h3>
      <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
        Upload your resume (PDF/DOCX) and paste a job description to calculate your ATS match score, keyword gaps, and interview prep questions.
      </p>

      {/* Feature cards preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 w-full max-w-lg text-left">
        <div className="p-3.5 rounded-xl bg-beige-50 border border-beige-200">
          <div className="flex items-center gap-2 mb-1">
            <Target size={15} className="text-green-700" />
            <p className="text-xs font-bold text-ink">ATS Match Score</p>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            0–100 score based on recruiter ATS algorithms
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-beige-50 border border-beige-200">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={15} className="text-green-700" />
            <p className="text-xs font-bold text-ink">Keyword Gaps</p>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Identifies missing required hard & soft skills
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-beige-50 border border-beige-200">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={15} className="text-green-700" />
            <p className="text-xs font-bold text-ink">Action Plan</p>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Bullet rewrites & targeted interview answers
          </p>
        </div>
      </div>

      {onLoadSample && (
        <div className="mt-8 pt-6 border-t border-beige-100 w-full max-w-xs">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline"
          >
            Or preview a sample ATS evaluation report →
          </button>
        </div>
      )}
    </div>
  );
}
