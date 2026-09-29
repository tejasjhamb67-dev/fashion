import type { CSSProperties, ReactNode } from "react";

import { pad } from "../format";

type Tone = "cream" | "chalk" | "stone" | "forest" | "navy";

type PlateProps = {
  /** What the photograph will be, e.g. "Macro: linen slub". */
  label: string;
  index?: number;
  ratio?: string;
  tone?: Tone;
  swatch?: string;
  className?: string;
  children?: ReactNode;
  priority?: boolean;
};

/**
 * Photography placeholder. Holds the exact aspect ratio the final image will
 * use (zero layout shift when real photos land) and names the shot it is
 * waiting for, like a contact-sheet slip.
 */
export function Plate({ label, index, ratio = "4 / 5", tone = "cream", swatch, className = "", children }: PlateProps) {
  const dark = tone === "forest" || tone === "navy";
  const style: CSSProperties = { aspectRatio: ratio };
  return (
    <div className={`pk-plate pk-plate--${tone} ${className}`} style={style} role="img" aria-label={`Photograph to come: ${label}`}>
      {swatch ? (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 block size-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy/10 opacity-90"
          style={{ backgroundColor: swatch }}
        />
      ) : null}
      <div className={`absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 ${dark ? "text-chalk/70" : "text-slate-ink"}`}>
        <span className="pk-micro">{index !== undefined ? `Plate ${pad(index)}` : "Plate"}</span>
        <span className="pk-micro">To be shot</span>
      </div>
      <div className={`absolute inset-x-0 bottom-0 p-3 ${dark ? "text-chalk" : "text-navy"}`}>
        <span className="pk-micro block max-w-[85%]">{label}</span>
      </div>
      {children}
    </div>
  );
}
