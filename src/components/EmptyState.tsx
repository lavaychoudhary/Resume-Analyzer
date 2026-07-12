import { ClipboardList } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ClipboardList size={28} className="mb-4 text-ink-faint" strokeWidth={1.5} />
      <p className="max-w-[280px] font-sans text-[14px] text-ink-muted">
        Upload a resume and paste a job description to generate your evaluation report.
      </p>
    </div>
  );
}
