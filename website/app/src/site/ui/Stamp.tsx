import type { ReactNode } from "react";

export function Stamp({ children, tone = "ink", className = "" }: { children: ReactNode; tone?: "ink" | "red"; className?: string }) {
  return <span className={`pk-stamp pk-micro ${tone === "red" ? "pk-stamp--red" : "text-slate-ink"} ${className}`}>{children}</span>;
}

/** The PICKLE P.C. mark: receipts, order slips, neck labels. */
export function PcMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex -rotate-3 flex-col items-center border-2 border-stamp px-3 py-1.5 text-stamp ${className}`}
      aria-label="PICKLE P.C."
    >
      <span className="pk-micro font-medium tracking-[0.25em]">Pickle</span>
      <span className="font-serif text-lg leading-none">P.C.</span>
    </span>
  );
}

export function Rule({ label, className = "" }: { label?: string; className?: string }) {
  if (!label) return <hr className={`border-0 border-t border-stone ${className}`} />;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="pk-micro shrink-0 text-slate-ink">{label}</span>
      <span className="h-px flex-1 bg-stone" aria-hidden />
    </div>
  );
}
