import type { Colourway, SizeOption } from "../catalog";

export function Swatches({
  colours,
  value,
  onChange,
  size = "lg",
}: {
  colours: Colourway[];
  value: string;
  onChange: (name: string) => void;
  size?: "lg" | "sm";
}) {
  const dot = size === "lg" ? "size-8" : "size-6";
  return (
    <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-1">
      {colours.map((colour) => {
        const active = colour.name === value;
        return (
          <button
            key={colour.code}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={colour.name}
            title={colour.name}
            onClick={() => onChange(colour.name)}
            className={`group relative flex size-12 items-center justify-center rounded-full border transition-colors duration-[180ms] ${
              active ? "border-navy" : "border-transparent hover:border-stone-deep"
            }`}
          >
            <span className={`block ${dot} rounded-full border border-navy/15`} style={{ backgroundColor: colour.hex }} />
            <span className="pk-micro pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap bg-navy px-2 py-1 text-chalk group-hover:block">
              {colour.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SizeSelector({
  sizes,
  value,
  onChange,
  invalid,
}: {
  sizes: SizeOption[];
  value: string | null;
  onChange: (label: string) => void;
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Size"
      aria-invalid={invalid || undefined}
      className={`grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] border-l border-t ${invalid ? "border-stamp" : "border-stone"}`}
    >
      {sizes.map((size) => {
        const active = value === size.label;
        return (
          <button
            key={size.label}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={!size.available}
            aria-label={size.available ? `Size ${size.label}` : `Size ${size.label}, sold out`}
            onClick={() => size.available && onChange(size.label)}
            className={`pk-price flex h-12 items-center justify-center border-b border-r transition-colors duration-[180ms] ${
              invalid ? "border-stamp" : "border-stone"
            } ${
              !size.available
                ? "pk-size-off cursor-not-allowed"
                : active
                  ? "bg-stone outline outline-1 -outline-offset-1 outline-navy"
                  : "hover:bg-cream"
            }`}
          >
            {size.label}
          </button>
        );
      })}
    </div>
  );
}
