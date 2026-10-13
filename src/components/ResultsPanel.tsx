import ScoreGauge from "./ScoreGauge";
import { KeywordSection, PointList } from "./FeedbackList";
import ImpactAssessment from "./ImpactAssessment";
import SoftSkillsPanel from "./SoftSkillsPanel";
import InterviewPrepPanel from "./InterviewPrepPanel";
import type { AnalysisResult } from "../types/analysis";
import { Award, Printer, CheckCircle, FileText, CheckCircle2 } from "lucide-react";

interface ResultsPanelProps {
  result: AnalysisResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <div className="space-y-6 animate-fadeUp">
      {/* ── Top ATS Score Summary Card (Naukri style) ── */}
      <div className="naukri-card p-6 sm:p-8 bg-white border border-beige-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-beige-100">
          <div className="flex-1 text-center sm:text-left">
            <div className="badge-green mb-3">
              <Award size={13} className="text-green-700" />
              <span>ATS COMPLIANCE AUDIT</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {result.score_label}
            </h2>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-xl">
              {result.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-ink-light">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-600" />
                <span>Standard ATS Section Parsing: Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-600" />
                <span>Job Description Fit: Computed</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <ScoreGauge score={result.match_score} label={result.score_label} />
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 hover:underline"
            >
              <Printer size={13} />
              Print / Save ATS Report
            </button>
          </div>
        </div>

        {/* Quick summary stats bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-beige-50 border border-beige-200">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Matched Keywords</p>
            <p className="font-display text-xl font-black text-green-700 mt-0.5">{result.matched_keywords.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-beige-50 border border-beige-200">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Missing Keywords</p>
            <p className="font-display text-xl font-black text-beige-800 mt-0.5">{result.missing_keywords.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-beige-50 border border-beige-200">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Key Strengths</p>
            <p className="font-display text-xl font-black text-green-700 mt-0.5">{result.strengths.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-beige-50 border border-beige-200">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Action Items</p>
            <p className="font-display text-xl font-black text-ink mt-0.5">{result.suggestions.length}</p>
          </div>
        </div>
      </div>

      {/* ── Keywords Matched & Missing ── */}
      <div className="naukri-card p-6 bg-white border border-beige-200">
        <h3 className="font-display text-base font-bold text-ink mb-4 flex items-center gap-2">
          <FileText size={18} className="text-green-600" />
          <span>ATS Keyword Match Analysis</span>
        </h3>
        <KeywordSection matched={result.matched_keywords} missing={result.missing_keywords} />
      </div>

      {/* ── Strengths & Skill Gaps ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PointList title="Key Strengths for this Role" items={result.strengths} variant="strength" />
        <PointList title="Identified Experience & Skill Gaps" items={result.gaps} variant="gap" />
      </div>

      {/* ── Impact & Bullet Assessment ── */}
      <ImpactAssessment data={result.impact_assessment} />

      {/* ── Soft Skills ── */}
      <SoftSkillsPanel data={result.soft_skills_assessment} />

      {/* ── Interview Prep Questions ── */}
      <InterviewPrepPanel questions={result.interview_prep_questions} />

      {/* ── Actionable ATS Recommendations & Notes ── */}
      <div className="naukri-card p-6 sm:p-8 bg-white border border-beige-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-ink">Actionable ATS Improvement Checklist</h3>
            <p className="text-xs text-ink-muted">Specific revisions to boost your score to the top 5% of applicants</p>
          </div>
        </div>

        <ol className="space-y-3 mt-4">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3 p-3.5 rounded-lg bg-beige-25 border border-beige-150">
              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white font-bold text-xs">
                {index + 1}
              </span>
              <span className="text-xs sm:text-sm text-ink-light leading-relaxed font-medium">
                {suggestion}
              </span>
            </li>
          ))}
        </ol>

        {/* ATS Parser Notes Callout */}
        <div className="mt-6 rounded-xl border border-beige-200 bg-beige-50 p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-green-700" />
            ATS Parser Compatibility Notes
          </h4>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
            {result.ats_notes}
          </p>
        </div>
      </div>
    </div>
  );
}
