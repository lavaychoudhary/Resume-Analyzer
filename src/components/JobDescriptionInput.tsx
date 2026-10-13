interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          2. Target Job Description
        </label>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
            value.length > 50
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-beige-100 text-ink-faint border-beige-200"
          }`}
        >
          {value.length} characters
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the target job description, key responsibilities, and required qualifications here to match against your resume..."
        rows={6}
        className="input-box resize-none text-sm placeholder:text-ink-faint leading-relaxed"
      />
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-faint">
        <span>Tip: Include required skills, tools & experience</span>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-ink-muted hover:text-ink hover:underline"
          >
            Clear text
          </button>
        )}
      </div>
    </div>
  );
}
