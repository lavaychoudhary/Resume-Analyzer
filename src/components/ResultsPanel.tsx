import ScoreGauge from "./ScoreGauge";
import { KeywordSection, PointList } from "./FeedbackList";
import ImpactAssessment from "./ImpactAssessment";
import SoftSkillsPanel from "./SoftSkillsPanel";
import InterviewPrepPanel from "./InterviewPrepPanel";
import type { AnalysisResult } from "../types/analysis";

interface ResultsPanelProps {
  result: AnalysisResult;
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="border-t-[1.5px] border-rule px-6 py-6 sm:px-8">{children}</div>;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <div className="glass-panel animate-fadeUp overflow-hidden">
      {/* Letterhead */}
      <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 bg-white/40">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
            Evaluation Report
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-espresso">{result.score_label}</h2>
          <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-espresso-muted">
            {result.summary}
          </p>
        </div>
        <ScoreGauge score={result.match_score} label={result.score_label} />
      </div>

      <Section>
        <KeywordSection matched={result.matched_keywords} missing={result.missing_keywords} />
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <PointList title="Strengths" items={result.strengths} variant="strength" />
          <PointList title="Gaps" items={result.gaps} variant="gap" />
        </div>
      </Section>

      <Section>
        <ImpactAssessment data={result.impact_assessment} />
      </Section>

      <Section>
        <SoftSkillsPanel data={result.soft_skills_assessment} />
      </Section>

      <Section>
        <InterviewPrepPanel questions={result.interview_prep_questions} />
      </Section>

      <Section>
        <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
          Suggestions
        </p>
        <ol className="space-y-3">
          {result.suggestions.map((s, i) => (
            <li key={i} className="flex gap-4 font-sans text-sm text-espresso leading-relaxed">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-beige-200 text-espresso-muted font-mono text-xs font-medium">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-xl border border-gold/30 bg-gold-soft px-5 py-4 shadow-sm">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold mb-2">
            ATS Notes
          </p>
          <p className="font-sans text-sm text-espresso-light leading-relaxed">{result.ats_notes}</p>
        </div>
      </Section>
    </div>
  );
}
