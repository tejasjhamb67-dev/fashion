import { Link } from "@tanstack/react-router";

import { getCategory, type Product } from "../catalog";
import { formatPrice } from "../format";

type Props = {
  product: Product;
  index?: number;
  ratio?: string;
  className?: string;
};

/**
 * Catalogue card. The frame holds a packshot on cream and, on hover or focus,
 * swaps to the macro plate (the fabric close-up) the brief asks for.
 */
export function ProductCard({ product, index, ratio = "4 / 5", className = "" }: Props) {
  const lead = product.colours[0];
  const soldOutAll = product.sizes.every((s) => !s.available);
  return (
    <article className={`group relative ${className}`}>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block outline-none">
        <div className="pk-plate relative" style={{ aspectRatio: ratio }}>
          {/* Packshot plate */}
          <div className="absolute inset-0 transition-opacity duration-[350ms] ease-[var(--ease-pickle)] group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 block size-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy/10"
              style={{ backgroundColor: lead.hex }}
            />
            <span className="pk-micro absolute left-3 top-3 text-slate-ink">{index !== undefined ? String(index).padStart(2, "0") : getCategory(product.category).index}</span>
            <span className="pk-micro absolute right-3 top-3 text-slate-ink">Packshot to come</span>
          </div>
          {/* Macro plate */}
          <div className="pk-plate--forest absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-[350ms] ease-[var(--ease-pickle)] group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <span className="pk-micro text-chalk">{product.macro}</span>
          </div>
          {soldOutAll ? (
            <span className="pk-stamp pk-stamp--red pk-micro absolute bottom-3 left-3 bg-chalk">Sold out</span>
          ) : null}
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <h3 className="pk-utility transition-colors duration-[180ms] group-hover:text-cricket">{product.name}</h3>
          <span className="pk-price shrink-0">{formatPrice(product.price)}</span>
        </div>
      </Link>
      <div className="mt-2 flex items-center gap-2" aria-label={`${product.colours.length} colourways`}>
        {product.colours.map((colour) => (
          <span
            key={colour.code}
            title={colour.name}
            className="block size-3 rounded-full border border-navy/15"
            style={{ backgroundColor: colour.hex }}
          />
        ))}
        <span className="pk-micro ml-1 text-slate-ink">{String(product.colours.length).padStart(2, "0")} colours</span>
      </div>
    </article>
  );
}
