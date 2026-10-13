import { useState } from "react";
import { ChevronDown, MessageSquare, HelpCircle, CheckCircle2 } from "lucide-react";
import type { InterviewQuestion } from "../types/analysis";

interface InterviewPrepPanelProps {
  questions: InterviewQuestion[];
}

export default function InterviewPrepPanel({ questions }: InterviewPrepPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white p-6 rounded-xl border border-beige-200 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
          <MessageSquare size={16} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-ink">Role-Specific Interview Questions</h3>
          <p className="text-xs text-ink-muted">High-probability questions tailored to your experience gaps & strengths</p>
        </div>
      </div>

      <div className="space-y-3 mt-5">
        {questions.map((q, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-green-300 bg-green-50/20 shadow-sm"
                  : "border-beige-200 bg-beige-25 hover:border-beige-300 hover:bg-white"
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded">
                    Question {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
                  >
                    <span>{isOpen ? "Hide Model Answer" : "View Model Answer"}</span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                <p className="font-sans text-sm font-bold text-ink leading-snug mt-2">
                  {q.question}
                </p>

                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-ink-muted">
                  <HelpCircle size={13} className="shrink-0 mt-0.5 text-beige-500" />
                  <p className="italic leading-relaxed">{q.rationale}</p>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 py-4 bg-white border-t border-green-200/80 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 mb-1.5">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span>Recommended Answer Strategy:</span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-ink-light leading-relaxed pl-5 border-l-2 border-green-500">
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
