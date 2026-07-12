import { NotebookPen } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="section-title !mb-0">
          <NotebookPen size={18} className="text-navy" strokeWidth={2.5} />
          <label>Job Description</label>
        </div>
        <span className="font-sans text-xs font-medium text-espresso-muted tracking-wide">{value.length} chars</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here — the more detail, the more precise the evaluation."
        rows={8}
        className="input-textarea"
      />
    </div>
  );
}
