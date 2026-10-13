import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";

interface AnalyzeButtonProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function AnalyzeButton({ disabled, loading, onClick }: AnalyzeButtonProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="btn-green text-base shadow-green"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin text-white" />
            <span>Scanning Resume...</span>
          </>
        ) : (
          <>
            <span>Analyze Resume Now</span>
            <ArrowRight size={18} className="text-white/90" />
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-faint">
        <ShieldCheck size={13} className="text-green-600" />
        <span>Instant ATS compatibility score & keyword breakdown</span>
      </div>
    </div>
  );
}
