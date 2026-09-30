import type { Colour } from "@/lib/catalog";

export function Swatch({ colour, size = 12, ring }: { colour: Colour; size?: number; ring?: boolean }) {
  const striped = colour.name.includes("Stripe");
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${ring ? "ring-1 ring-ink ring-offset-2 ring-offset-paper" : ""}`}
      style={{
        width: size,
        height: size,
        background: striped ? `repeating-linear-gradient(90deg, ${colour.hex} 0 2px, #f1ede4 2px 4px)` : colour.hex,
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)",
      }}
    />
  );
}
