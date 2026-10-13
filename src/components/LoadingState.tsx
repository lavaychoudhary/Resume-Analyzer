export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
      {/* Animated document scan */}
      <div className="relative mb-8">
        <div className="relative w-20 h-28 rounded-xl border border-white/10 overflow-hidden"
          style={{ background: "rgba(15,23,42,0.9)" }}>
          <div className="absolute inset-x-0 top-3 space-y-2.5 px-3">
            {[3, 4, 2.5, 4, 3.5].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-white/10" style={{ width: `${w / 4 * 100}%` }} />
            ))}
          </div>
          {/* Scan line */}
          <div className="absolute inset-x-0 h-8 animate-scan"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.3), transparent)", filter: "blur(2px)" }} />
        </div>
        {/* Outer glow rings */}
        <div className="absolute -inset-4 rounded-full opacity-20 animate-ping"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)" }} />
      </div>

      <p className="font-display text-base font-bold text-white mb-2">Analyzing Your Resume</p>
      <p className="font-sans text-sm text-slate-400 max-w-xs">
        Our AI is reading every line, matching skills, and generating your personalized report…
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-blue-500"
            style={{ animation: `pulse_slow 1.2s ease-in-out ${i * 0.3}s infinite` }} />
        ))}
      </div>
    </div>
  );
}
