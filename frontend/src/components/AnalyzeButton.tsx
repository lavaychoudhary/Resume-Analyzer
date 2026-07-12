import { Loader2, ScanLine } from "lucide-react";

interface AnalyzeButtonProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function AnalyzeButton({ disabled, loading, onClick }: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="btn-primary"
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Analyzing resume…
        </>
      ) : (
        <>
          <ScanLine size={20} />
          Analyze Resume
        </>
      )}
    </button>
  );
}
