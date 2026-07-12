export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
      <div className="relative h-32 w-24 overflow-hidden rounded-xl border border-beige-200 bg-white shadow-soft">
        <div className="absolute inset-x-0 top-3 space-y-2.5 px-3">
          <div className="h-1.5 w-3/4 rounded-full bg-beige-200" />
          <div className="h-1.5 w-full rounded-full bg-beige-200" />
          <div className="h-1.5 w-1/2 rounded-full bg-beige-200" />
          <div className="h-1.5 w-full rounded-full bg-beige-200" />
          <div className="h-1.5 w-2/3 rounded-full bg-beige-200" />
        </div>
        <div className="absolute inset-x-0 top-0 h-8 animate-scan bg-gradient-to-b from-transparent via-navy/20 to-transparent blur-[2px]" />
      </div>
      <p className="mt-6 font-sans text-xs font-semibold uppercase tracking-widest text-espresso">
        Reading the resume line by line
      </p>
      <p className="mt-1.5 font-sans text-sm text-espresso-muted">This usually takes a few seconds</p>
    </div>
  );
}
