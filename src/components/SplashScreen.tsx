import { useEffect, useState } from "react";
import { CheckCircle2, Search, Sparkles, X } from "lucide-react";

interface SplashScreenProps {
  onCancel?: () => void;
}

const STEPS = [
  "Reading resume document and layout structure...",
  "Extracting technical & soft skills...",
  "Matching keywords against Job Description...",
  "Evaluating ATS score and resume impact...",
  "Formulating interview questions & model answers...",
];

export default function SplashScreen({ onCancel }: SplashScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    // Progress bar smooth advance
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94; // hold near 94% until completion
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 94);
      });
    }, 300);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(35, 30, 24, 0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-beige-200 shadow-2xl p-6 sm:p-8 animate-fadeUp overflow-hidden">
        
        {/* Subtle decorative green top highlight */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-green-700" />

        {/* ATS Badge & Cancel */}
        <div className="flex items-center justify-between mb-4">
          <div className="badge-green">
            <Search size={13} className="text-green-700" />
            <span className="font-semibold text-xs tracking-wide">ATS SCANNER IN PROGRESS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
              {progress}%
            </span>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                title="Cancel analysis"
                className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-beige-100 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Splash Image Showcase */}
        <div className="relative mx-auto my-3 w-56 h-56 sm:w-64 sm:h-64 rounded-xl bg-beige-50 border border-beige-200 p-3 flex items-center justify-center shadow-inner overflow-hidden">
          <img
            src="/splash.png"
            alt="Resume ATS Analysis Scanner"
            className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-700"
          />

          {/* Animated Green Laser Scanning Bar */}
          <div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-[0_0_12px_#22c55e] animate-scanline"
          />

          {/* Subtle radar circular pulse */}
          <div className="absolute inset-0 rounded-xl border border-green-500/20 pointer-events-none" />
        </div>

        {/* Text and status */}
        <div className="text-center mt-5">
          <h3 className="font-display text-xl font-extrabold text-ink tracking-tight flex items-center justify-center gap-2">
            <span>Analyzing Your Resume</span>
            <Sparkles size={18} className="text-green-600 animate-pulse" />
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Checking ATS keyword density, formatting score, and qualification fit.
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-5">
          <div className="w-full h-2.5 rounded-full bg-beige-100 border border-beige-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current step text */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-ink-light">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
            <span className="truncate">{STEPS[currentStepIndex]}</span>
          </div>
        </div>

        {/* Trust Note */}
        <div className="mt-6 pt-4 border-t border-beige-100 flex items-center justify-between text-[11px] text-ink-faint">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-green-600" />
            <span>ATS Compatibility Engine</span>
          </div>
          <span>100% Secure & Confidential</span>
        </div>
      </div>
    </div>
  );
}
