import { useState } from "react";
import { PenSquare } from "lucide-react";
import UploadPanel from "./components/UploadPanel";
import JobDescriptionInput from "./components/JobDescriptionInput";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultsPanel from "./components/ResultsPanel";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import { analyzeResume, AnalysisError } from "./lib/api";
import { sampleAnalysis } from "./lib/sampleAnalysis";
import type { AnalysisResult } from "./types/analysis";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const canAnalyze = !!file && jobDescription.trim().length > 0 && !loading;

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume(file, jobDescription);
      setResult(data);
    } catch (err) {
      if (err instanceof AnalysisError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-beige-50">
      {/* Ambient glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-terracotta/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-navy/5 blur-[120px] pointer-events-none" />

      <header className="relative z-10 border-b border-beige-200 bg-white/70 backdrop-blur-md px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-lg shadow-navy/20">
            <PenSquare size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-espresso tracking-tight">AI Resume Analyzer</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
          {/* Left column — intake form */}
          <div className="lg:sticky lg:top-8">
            <div className="glass-panel p-6">
              <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-espresso-muted">
                Step 1
              </p>
              <h2 className="mb-6 font-display text-2xl font-bold text-espresso">Submit for Review</h2>

              <div className="space-y-6">
                <UploadPanel file={file} onFileSelected={setFile} />
                <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
                <AnalyzeButton disabled={!canAnalyze} loading={loading} onClick={handleAnalyze} />

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 animate-fadeIn">
                    <p className="font-sans text-sm font-medium text-rose-600">{error}</p>
                  </div>
                )}

                {!result && (
                  <button
                    type="button"
                    onClick={() => setResult(sampleAnalysis)}
                    className="w-full mt-4 font-sans text-xs font-medium uppercase tracking-widest text-espresso-muted underline decoration-dotted underline-offset-4 hover:text-navy transition-colors"
                  >
                    View a sample report
                  </button>
                )}
              </div>
            </div>
            
            {/* Catchy Tip Card */}
            <div className="mt-6 bg-white/50 border border-beige-200 rounded-xl px-5 py-4 shadow-sm">
              <p className="text-sm text-espresso-muted leading-relaxed">
                <span className="text-terracotta font-semibold">💡 Pro Tip:</span> Paste the complete job description, including required qualifications and tech stack, for the most accurate and actionable analysis.
              </p>
            </div>
          </div>

          {/* Right column — report */}
          <div className="lg:pt-2">
            {loading ? (
              <LoadingState />
            ) : result ? (
              <ResultsPanel result={result} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}