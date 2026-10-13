import { useState, useRef } from "react";
import UploadPanel from "./components/UploadPanel";
import JobDescriptionInput from "./components/JobDescriptionInput";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultsPanel from "./components/ResultsPanel";
import SplashScreen from "./components/SplashScreen";
import EmptyState from "./components/EmptyState";
import { analyzeResume, AnalysisError } from "./lib/api";
import { sampleAnalysis } from "./lib/sampleAnalysis";
import type { AnalysisResult } from "./types/analysis";
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Target,
  FileCheck2,
  Sparkles,
} from "lucide-react";

type Phase = "idle" | "splash" | "done";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const resultsRef = useRef<HTMLDivElement>(null);

  const canAnalyze = !!file && jobDescription.trim().length > 0 && phase === "idle";

  async function handleAnalyze() {
    if (!file) return;
    setError(null);
    setPhase("splash"); // Triggers the splash screen overlay

    const startTime = Date.now();

    try {
      const data = await analyzeResume(file, jobDescription);

      // Keep splash screen visible for at least 2.2 seconds so user experiences the complete scanner
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2200 - elapsedTime);

      setTimeout(() => {
        setResult(data);
        setPhase("done");
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }, remainingTime);
    } catch (err) {
      if (err instanceof AnalysisError) {
        setError(err.message);
      } else {
        setError("Analysis error. Please try again.");
      }
      setPhase("idle");
    }
  }

  function handleFillSampleData() {
    const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 264 >> stream
BT
/F1 12 Tf
72 720 Td
(John Doe - Senior Backend Engineer) Tj
0 -20 Td
(Skills: Python, FastAPI, Docker, AWS, PostgreSQL, REST APIs) Tj
0 -20 Td
(Experience: Built scalable microservices and optimized database queries.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000560 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
633
%%EOF`;

    const sampleBlob = new Blob([minimalPdf], { type: "application/pdf" });
    const sampleFile = new File([sampleBlob], "John_Doe_Senior_Resume.pdf", { type: "application/pdf" });
    setFile(sampleFile);
    setJobDescription(
      "Senior Full-Stack Engineer\n\nRequirements:\n• 4+ years software engineering experience with Python and FastAPI\n• Strong expertise in PostgreSQL, Docker, AWS, and REST APIs\n• Experience with Terraform, Kubernetes, and GraphQL is highly desirable\n• Proven track record in microservices architecture and cloud-native deployments"
    );
  }

  function handleLoadSample() {
    setError(null);
    setResult(sampleAnalysis);
    setPhase("done");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#111111] flex flex-col font-sans">
      
      {/* ── Splash Screen Modal (Appears when Analyze button is clicked) ── */}
      {phase === "splash" && <SplashScreen onCancel={() => setPhase("idle")} />}

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-beige-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo strictly written with black as requested */}
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-black text-black tracking-tight select-none">
              AI Resume Analyzer
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-ink-muted">
            <a href="#analyzer" className="hover:text-green-700 transition-colors">
              ATS Checker
            </a>
            <a href="#how-it-works" className="hover:text-green-700 transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-green-700 transition-colors">
              ATS Benefits
            </a>
            <a href="#faq" className="hover:text-green-700 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTA Badge */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex badge-green text-xs font-bold">
              ✓ Free ATS Score Check
            </span>
            {result && (
              <button
                type="button"
                onClick={() => {
                  setPhase("idle");
                  setResult(null);
                }}
                className="text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                + New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Banner (Naukri ATS Resume Analyzer Style) ── */}
      <section className="bg-white border-b border-beige-200 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold uppercase tracking-wider mb-4">
                <Target size={14} className="text-green-600" />
                <span>ATS Compatibility Engine</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight leading-[1.15]">
                Get Your Free Resume Score &<br className="hidden sm:inline" />
                <span className="text-green-600"> ATS Compatibility Report</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Scan your resume against any job description to discover your ATS match score, uncover missing recruiter keywords, and get high-impact bullet improvements.
              </p>

              {/* Trust Badges Bar */}
              <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-semibold text-ink-light">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-[11px]">
                    ✓
                  </div>
                  <span>Instant ATS Score (0–100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-[11px]">
                    ✓
                  </div>
                  <span>Missing Keyword Detector</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-[11px]">
                    ✓
                  </div>
                  <span>Tailored Interview Q&A</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-3 bg-beige-50 rounded-2xl border border-beige-200 shadow-md max-w-xs w-full">
                <div className="bg-white rounded-xl p-3 border border-beige-200 overflow-hidden flex flex-col items-center">
                  <img
                    src="/splash.png"
                    alt="AI Resume Analyzer Preview"
                    className="w-48 h-48 object-contain"
                  />
                  <div className="w-full mt-3 pt-3 border-t border-beige-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-ink">ATS Scanner</span>
                    <span className="badge-green text-[11px]">Ready to scan</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Main Tool Workspace (Naukri Layout) ── */}
      <main id="analyzer" className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form (45% width on large screens) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="naukri-card p-6 sm:p-7 bg-white border border-beige-200">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-beige-100">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    ATS Resume Evaluator
                  </h2>
                  <p className="text-xs text-ink-muted">
                    Compare your profile against recruiter requirements
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-200">
                  <FileCheck2 size={18} />
                </div>
              </div>

              <div className="space-y-5">
                <UploadPanel file={file} onFileSelected={setFile} />

                <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

                <AnalyzeButton
                  disabled={!canAnalyze}
                  loading={phase === "splash"}
                  onClick={handleAnalyze}
                />

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs animate-fadeIn flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      !
                    </div>
                    <div>
                      {error.includes("not a resume") ? (
                        <>
                          <p className="font-bold text-sm text-red-800">This is not a resume!</p>
                          <p className="mt-1 text-xs text-red-700 leading-relaxed">
                            {error.replace(/^This is not a resume!\s*/i, "") || "Please upload a valid resume or CV file (PDF or DOCX format) containing work experience and skills."}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-red-700 leading-relaxed">{error}</p>
                      )}
                    </div>
                  </div>
                )}

                {phase === "idle" && (
                  <div className="pt-2 flex flex-col gap-2 text-center">
                    {(!file || jobDescription.length === 0) && (
                      <button
                        type="button"
                        onClick={handleFillSampleData}
                        className="text-xs font-semibold text-ink-muted hover:text-green-700 hover:underline inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-beige-50 border border-beige-200 transition-colors"
                      >
                        <Sparkles size={13} className="text-green-600" />
                        <span>Auto-fill with sample resume & job description</span>
                      </button>
                    )}
                    {!result && (
                      <button
                        type="button"
                        onClick={handleLoadSample}
                        className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline inline-flex items-center justify-center gap-1"
                      >
                        <span>Explore a sample ATS analysis report</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="naukri-card p-5 bg-beige-25 border border-beige-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-green-600" />
                ATS Best Practice
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Ensure your resume contains exact keyword phrases from the job description's "Required Skills" and "Qualifications" section. ATS systems prioritize exact lexical matches.
              </p>
            </div>
          </div>

          {/* Right Column: Results / Empty State */}
          <div ref={resultsRef} className="lg:col-span-7">
            {phase === "done" && result ? (
              <ResultsPanel result={result} />
            ) : (
              <EmptyState onLoadSample={handleLoadSample} />
            )}
          </div>

        </div>
      </main>

      {/* ── ATS Features & Benefits Section (Naukri Style) ── */}
      <section id="benefits" className="bg-white border-t border-b border-beige-200 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-green text-xs font-bold uppercase tracking-wider">
              Recruiter-Grade Insights
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink mt-3">
              Why Test Your Resume With Our ATS Analyzer?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Over 75% of resumes are filtered out before reaching a human recruiter. Make sure yours stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="naukri-card p-6 bg-beige-25 border border-beige-200 hover:border-green-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-1">
                Beat ATS Screening Bots
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Identify layout, font, and section issues that cause applicant tracking systems to fail parsing your data.
              </p>
            </div>

            <div className="naukri-card p-6 bg-beige-25 border border-beige-200 hover:border-green-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-1">
                Keyword Gap Spotter
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Discover specific hard and soft skill keywords from the job description that your resume is missing.
              </p>
            </div>

            <div className="naukri-card p-6 bg-beige-25 border border-beige-200 hover:border-green-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-1">
                Action-Oriented Rewrites
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Transform passive bullet points into high-impact, quantifiable accomplishment statements.
              </p>
            </div>

            <div className="naukri-card p-6 bg-beige-25 border border-beige-200 hover:border-green-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold mb-4">
                04
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-1">
                Interview Prep Q&A
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Anticipate role-specific interview questions based on your background and the target position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="py-16 bg-[#F8F6F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-beige text-xs font-bold uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink mt-3">
              How The ATS Analyzer Works
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Get comprehensive feedback in under 5 seconds with zero sign-up required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="naukri-card p-7 bg-white text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-700 flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-2">
                Upload Your Resume
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Upload your resume in PDF or DOCX format. Our parser extracts all text, contact info, experience, and skills.
              </p>
            </div>

            <div className="naukri-card p-7 bg-white text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-700 flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-2">
                Add Job Description
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Copy and paste the job description you are targeting to ensure a relevant role-specific keyword match.
              </p>
            </div>

            <div className="naukri-card p-7 bg-white text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 text-green-700 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="font-display text-base font-bold text-ink mb-2">
                Get Your ATS Report
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                View your 0–100 compatibility score, matched keywords, missing terms, bullet rewrites, and interview advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Naukri ATS Standard) ── */}
      <section id="faq" className="bg-white border-t border-beige-200 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="badge-green text-xs font-bold uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink mt-3">
              Everything You Need to Know About ATS
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is an ATS (Applicant Tracking System)?",
                a: "An ATS is software utilized by corporate employers and recruiting platforms to automatically collect, screen, sort, and rank candidate resumes before any human hiring manager reads them.",
              },
              {
                q: "What is a good ATS Resume Match Score?",
                a: "An ATS match score of 75% or higher is considered strong and substantially increases the odds of passing automated screening filters. Scores above 85% place you in the top tier of applicant submissions.",
              },
              {
                q: "Should I submit my resume as PDF or DOCX?",
                a: "Both PDF and DOCX are widely accepted. Modern ATS systems parse standard PDF documents flawlessly, provided there are no complex multi-column graphics, text boxes, or scanned image representations of text.",
              },
              {
                q: "Is my resume kept private and secure?",
                a: "Yes. Your resume document is only parsed in memory during your active analysis session to generate the compatibility score. It is never permanently stored, published, or shared with third parties.",
              },
            ].map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-beige-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-display text-sm font-bold text-ink bg-beige-25 hover:bg-beige-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-ink-muted transition-transform duration-200 shrink-0 ml-3 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-white border-t border-beige-200 text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-beige-200 py-8 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-black text-black tracking-tight">
              AI Resume Analyzer
            </span>
            <span className="text-xs text-ink-faint">· ATS Resume Checker</span>
          </div>

          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-ink-muted">
            <a href="#analyzer" className="hover:text-green-700">Check Score</a>
            <a href="#how-it-works" className="hover:text-green-700">How It Works</a>
            <a href="#faq" className="hover:text-green-700">FAQ</a>
          </div>
        </div>
      </footer>

    </div>
  );
}