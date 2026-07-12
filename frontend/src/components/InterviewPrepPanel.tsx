import { useState } from "react";
import { ChevronDown, MessagesSquare } from "lucide-react";
import type { InterviewQuestion } from "../types/analysis";

interface InterviewPrepPanelProps {
  questions: InterviewQuestion[];
}

export default function InterviewPrepPanel({ questions }: InterviewPrepPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="section-title">
        <MessagesSquare size={18} className="text-navy" strokeWidth={2.5} />
        <h3 className="!mb-0">Practice For Your Interview</h3>
      </div>
      <p className="mb-6 font-sans text-sm leading-relaxed text-espresso-muted">
        Questions this role's interviewer is likely to ask, based on this specific resume.
      </p>

      <div className="space-y-4">
        {questions.map((q, i) => {
          const open = openIndex === i;
          return (
            <div key={i} className="rounded-xl border border-beige-200 bg-white/60 overflow-hidden shadow-sm transition-all hover:shadow-md">
              <div className="p-5">
                <p className="font-mono text-xs font-bold text-navy mb-2">
                  Q{String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-sans text-base font-semibold leading-snug text-espresso">
                  {q.question}
                </p>
                <p className="mt-2 font-sans text-sm italic text-espresso-muted border-l-2 border-beige-300 pl-3">
                  {q.rationale}
                </p>

                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="mt-4 flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-navy transition-colors hover:text-navy-light"
                >
                  {open ? "Hide Answer" : "Show Answer"}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {open && (
                <div className="animate-fadeUp border-t border-beige-200 bg-navy-soft px-5 py-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-widest text-navy mb-2">
                    Model Answer
                  </p>
                  <p className="font-sans text-sm font-medium leading-relaxed text-espresso">
                    {q.model_answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
