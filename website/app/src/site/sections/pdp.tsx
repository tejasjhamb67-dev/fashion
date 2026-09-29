import { useEffect, useRef, useState } from "react";

import { getCategory, itemRef, type Product } from "../catalog";
import { useCart } from "../cart";
import { formatPrice, pad } from "../format";
import { AddToBag } from "../ui/AddToBag";
import { Plate } from "../ui/Plate";
import { RatingSummary } from "../ui/Reviews";
import { SizeSelector, Swatches } from "../ui/Selectors";
import { SpecSheet } from "../ui/SpecSheet";
import type { Review } from "@/lib/api/store.functions";

/** Alternating asymmetric collage: full-width frames punctuated by a paired row. */
export function Gallery({ product, swatch }: { product: Product; swatch: string }) {
  const shots = product.shots;
  const tones = ["cream", "stone", "chalk", "forest", "cream"] as const;
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3">
      {shots.map((shot, i) => {
        const paired = i === 1 || i === 2;
        return (
          <Plate
            key={shot}
            index={i + 1}
            label={shot}
            tone={tones[i % tones.length]}
            ratio={i === 0 ? "3 / 4" : paired ? "4 / 5" : "5 / 4"}
            swatch={i === 0 || i === 3 ? swatch : undefined}
            className={paired ? "col-span-1" : "col-span-2"}
          />
        );
      })}
    </div>
  );
}

type ConsoleProps = { product: Product; reviews: Review[]; colour: string; setColour: (name: string) => void };

export function PurchaseConsole({ product, reviews, colour, setColour }: ConsoleProps) {
  const cart = useCart();
  const single = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(single && product.sizes[0].available ? product.sizes[0].label : null);
  const [sizeError, setSizeError] = useState(false);
  const [dockVisible, setDockVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const soldOut = product.sizes.every((s) => !s.available);
  const active = product.colours.find((c) => c.name === colour) ?? product.colours[0];

  // Mobile dock: appears once the main Add to bag button scrolls out of view.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setDockVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function add(): boolean {
    if (!size) {
      setSizeError(true);
      sizeRef.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      sizeRef.current?.querySelector<HTMLButtonElement>("button[aria-disabled='false']")?.focus({ preventScroll: true });
      return false;
    }
    cart.add({ slug: product.slug, colour, size });
    return true;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="pk-micro text-slate-ink">{product.series}</p>
            <p className="pk-micro text-slate-ink">Item ref: {itemRef(product, active)}</p>
          </div>
          <h1 className="pk-h2">{product.name}</h1>
          <p className="pk-price text-base">{formatPrice(product.price)}</p>
          <RatingSummary reviews={reviews} />
        </div>

        <p className="pk-h3 max-w-[36ch]">{product.tagline}</p>

        <div>
          <p className="pk-micro mb-2">
            Colour: <span className="text-slate-ink">{active.name}</span>
          </p>
          <Swatches colours={product.colours} value={colour} onChange={setColour} />
        </div>

        <div ref={sizeRef}>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="pk-micro">
              Size: <span className="text-slate-ink">{single ? "One size" : (size ?? "Select")}</span>
            </p>
            {!single ? (
              <a href="#size-guide" onClick={() => document.getElementById("size-guide")?.setAttribute("open", "")} className="pk-micro pk-link text-slate-ink">
                Size guide
              </a>
            ) : null}
          </div>
          <SizeSelector
            sizes={product.sizes}
            value={size}
            invalid={sizeError}
            onChange={(s) => {
              setSize(s);
              setSizeError(false);
            }}
          />
          {sizeError ? (
            <p role="alert" className="pk-micro mt-2 border border-stone bg-cream px-3 py-2 text-stamp">
              Choose a size first.
            </p>
          ) : null}
          {product.lowStock && !soldOut ? <p className="pk-micro mt-2 text-stamp">Small run: {pad(product.sizes.filter((s) => s.available).length)} sizes left in stock</p> : null}
        </div>

        <AddToBag ref={buttonRef} price={product.price} onAdd={add} disabled={soldOut} />

        <ul className="pk-micro grid grid-cols-3 border-l border-t border-stone text-slate-ink">
          {["Ships in 2 days", "Free 14-day returns", "Made in India"].map((t) => (
            <li key={t} className="border-b border-r border-stone px-2 py-3 text-center">
              {t}
            </li>
          ))}
        </ul>

        <div className="space-y-4 leading-relaxed">
          {product.description.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        <SpecSheet product={product} />

        <p className="pk-micro text-slate-ink">
          Department: {getCategory(product.category).index} / {getCategory(product.category).label}
        </p>
      </div>

      {/* Mobile sticky purchase dock */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-stone bg-chalk/95 backdrop-blur-sm transition-transform duration-[350ms] ease-[var(--ease-pickle)] motion-reduce:transition-none md:hidden ${
          dockVisible ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!dockVisible}
        inert={!dockVisible}
      >
        <div className="flex h-16 items-center gap-3 px-4 pb-[env(safe-area-inset-bottom)]">
          <div className="min-w-0 flex-1">
            <p className="pk-utility truncate">{product.name}</p>
            <p className="pk-micro text-slate-ink">
              {active.name} / {size ?? "Select size"} // {formatPrice(product.price)}
            </p>
          </div>
          <div className="w-36 shrink-0">
            <AddToBag price={product.price} onAdd={add} disabled={soldOut} compact label="Add" />
          </div>
        </div>
      </div>
    </>
  );
}

/** Colour lifted into the gallery, so swatch choice reads on the plates too. */
export function ProductStage({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [colour, setColour] = useState(product.colours[0].name);
  const swatch = (product.colours.find((c) => c.name === colour) ?? product.colours[0]).hex;
  return (
    <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
      <div className="min-w-0">
        <Gallery product={product} swatch={swatch} />
      </div>
      <div className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
        <PurchaseConsole product={product} reviews={reviews} colour={colour} setColour={setColour} />
      </div>
    </div>
  );
}
