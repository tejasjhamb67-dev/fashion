import { MAX_QTY } from "../cart";
import { pad } from "../format";

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center border border-stone" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className="flex size-11 items-center justify-center text-lg transition-colors hover:bg-cream"
        onClick={() => onChange(value - 1)}
        aria-label={value === 1 ? `Remove ${label}` : `Decrease quantity of ${label}`}
      >
        −
      </button>
      <span className="pk-price w-8 text-center" aria-live="polite">
        {pad(value)}
      </span>
      <button
        type="button"
        className="flex size-11 items-center justify-center text-lg transition-colors hover:bg-cream disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label={`Increase quantity of ${label}`}
      >
        +
      </button>
    </div>
  );
}
