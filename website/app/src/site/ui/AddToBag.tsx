import { forwardRef, useEffect, useState } from "react";

import { formatPrice } from "../format";

type Props = {
  price: number;
  onAdd: () => boolean;
  disabled?: boolean;
  compact?: boolean;
  label?: string;
};

/**
 * The primary purchase control. Washed navy at rest; on a successful add it
 * turns cricket green with a check for a beat while the bag drawer opens.
 */
export const AddToBag = forwardRef<HTMLButtonElement, Props>(function AddToBag(
  { price, onAdd, disabled, compact, label = "Add to bag" },
  ref,
) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => {
        if (onAdd()) setAdded(true);
      }}
      className={`pk-button-type flex h-12 w-full items-center justify-between gap-4 px-5 text-paper transition-colors duration-[180ms] ease-out disabled:cursor-not-allowed disabled:bg-slate-ink ${
        added ? "bg-cricket" : "bg-navy hover:bg-cricket"
      } ${compact ? "px-4" : ""}`}
    >
      <span className="flex items-center gap-2">
        {added ? (
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2.5 8.5l3.5 3.5 7.5-8" />
          </svg>
        ) : null}
        <span aria-live="polite">{disabled ? "Sold out" : added ? "Added" : label}</span>
      </span>
      {!compact ? <span className="pk-price">{formatPrice(price)}</span> : null}
    </button>
  );
});
