import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { getProduct, liveCategories, products as allProducts, productsIn, type Product } from "../catalog";
import { useCart } from "../cart";
import { AddToBag } from "../ui/AddToBag";
import { Plate } from "../ui/Plate";
import { ProductCard } from "../ui/ProductCard";
import { Swatches } from "../ui/Selectors";
import { Stamp } from "../ui/Stamp";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-stone">
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
        <div className="flex flex-col justify-between gap-12 px-4 pb-12 pt-10 md:px-8 md:py-16 lg:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <Stamp>Series 01 // Summer 2026</Stamp>
            <Stamp tone="red">Match day record</Stamp>
          </div>
          <div>
            <h1 id="hero-title" className="pk-display max-w-[9ch]">
              Good clothes. Bad plans.
            </h1>
            <p className="mt-6 max-w-[38ch] text-slate-ink">
              Caps, heavyweight tees, tailored shorts and Belgian linen, cut for the long Indian summer and the lunch that turns into dinner.
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Link to="/shop" className="pk-button-type group inline-flex items-center gap-3 pb-1">
              <span className="pk-link">Discover the catalogue</span>
              <span className="transition-transform duration-[180ms] group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
            <dl className="pk-micro grid grid-cols-2 gap-x-6 gap-y-1 text-slate-ink">
              <dt>Pieces</dt>
              <dd className="text-navy">{String(allProducts.length).padStart(2, "0")}</dd>
              <dt>Batch</dt>
              <dd className="text-navy">K-88 / Mumbai</dd>
            </dl>
          </div>
        </div>
        <div className="overflow-hidden border-stone md:border-l">
          <Plate
            index={1}
            tone="forest"
            ratio="4 / 5"
            label="Editorial: The Sunday Overshirt and the Match Cap, late-day light, pavilion steps"
            className="pk-settle h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}

export function CategoryNavigator() {
  const cats = liveCategories();
  return (
    <section aria-labelledby="cat-title" className="border-b border-stone">
      <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-4 pb-4 pt-10 md:px-8">
        <h2 id="cat-title" className="pk-utility">
          The catalogue, by department
        </h2>
        <Link to="/shop" className="pk-micro pk-link text-slate-ink">
          View all
        </Link>
      </div>
      <ul className="pk-rail flex overflow-x-auto border-t border-stone">
        {cats.map((cat) => {
          const first = productsIn(cat.id)[0];
          return (
            <li key={cat.id} className="w-[78vw] shrink-0 border-r border-stone last:border-r-0 sm:w-[46vw] lg:w-1/4">
              <Link
                to="/shop"
                search={{ category: cat.id }}
                className="group flex h-full flex-col gap-4 bg-chalk p-4 transition-colors duration-[350ms] ease-[var(--ease-pickle)] hover:bg-cream md:p-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="pk-utility">
                    {cat.index} / {cat.panel}
                  </span>
                  <span className="pk-micro text-slate-ink">{String(productsIn(cat.id).length).padStart(2, "0")} pieces</span>
                </div>
                <div className="pk-grayscale-shift">
                  <Plate label={`${cat.panel}: ${first?.macro ?? cat.note}`} ratio="4 / 3" tone="stone" swatch={first?.colours[0].hex} />
                </div>
                <p className="pk-micro text-slate-ink">({cat.note})</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function MatchCapShowcase() {
  const product = getProduct("the-match-cap") as Product;
  const cart = useCart();
  const [colour, setColour] = useState(product.colours[0].name);
  const active = product.colours.find((c) => c.name === colour) ?? product.colours[0];

  return (
    <section aria-labelledby="showcase-title" className="border-b border-stone">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[3fr_2fr]">
        <div className="border-stone lg:border-r">
          <Plate index={2} tone="cream" ratio="16 / 11" label="Macro: washed Irish linen slub, 6-row peak stitching, cast brass buckle" swatch={active.hex} className="border-0" />
        </div>
        <div className="flex flex-col gap-8 px-4 py-10 md:px-8 lg:py-14">
          <div className="flex items-center justify-between">
            <span className="pk-micro text-slate-ink">No. 02 // Signature piece</span>
            <span className="pk-micro text-slate-ink">Item ref {product.ref}-{active.code}</span>
          </div>
          <div>
            <h2 id="showcase-title" className="pk-h1">
              The Match Cap
            </h2>
            <p className="pk-micro mt-3">100% Irish linen // Unstructured crown</p>
            <p className="mt-5 max-w-[42ch] text-slate-ink">{product.tagline}</p>
          </div>
          <dl className="divide-y divide-stone border-y border-stone">
            {product.finishing.slice(0, 3).map((row) => (
              <div key={row.label} className="grid grid-cols-[8rem_1fr] gap-4 py-2.5">
                <dt className="pk-micro pt-0.5 text-slate-ink">{row.label}</dt>
                <dd className="text-sm">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="pk-micro mb-2">
              Colour: <span className="text-slate-ink">{active.name}</span>
            </p>
            <Swatches colours={product.colours} value={colour} onChange={setColour} />
          </div>
          <div className="space-y-3">
            <AddToBag
              price={product.price}
              onAdd={() => {
                cart.add({ slug: product.slug, colour, size: "O/S" });
                return true;
              }}
            />
            <Link to="/product/$slug" params={{ slug: product.slug }} className="pk-micro pk-link block w-fit text-slate-ink">
              Full specification and reviews
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorldStatement() {
  return (
    <section aria-labelledby="world-title" className="border-b border-stone bg-cream">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 md:grid-cols-[1fr_2fr] md:px-8 md:py-24">
        <div className="pk-micro space-y-1 text-slate-ink">
          <p>No. 04 / World statement</p>
          <p>Pickle Leisure Guild</p>
          <p>Reg. ref. 2026-X</p>
        </div>
        <div>
          <p id="world-title" className="pk-display max-w-[16ch]">
            Familiar garments, reconstructed without the hype.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["01", "Weight you can feel", "Tees at 240 to 280 GSM. Linen at 170. Nothing thin enough to see through."],
              ["02", "No front logos", "Blind embroidery, woven tabs and one loud graphic a season. That is the rule."],
              ["03", "Made to crease", "Flax and washed linen that look better on day three than day one."],
            ].map(([n, title, body]) => (
              <div key={n} className="border-t border-stone-deep pt-4">
                <p className="pk-micro text-slate-ink">{n}</p>
                <p className="pk-h3 mt-2">{title}</p>
                <p className="mt-2 text-sm text-slate-ink">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Lateral rail with a custom hairline scroll indicator. */
export function ProductRail({ title, products, meta }: { title: string; products: Product[]; meta?: string }) {
  const railRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  useEffect(() => {
    const rail = railRef.current;
    const bar = barRef.current;
    if (!rail || !bar) return;
    let frame = 0;
    function update() {
      frame = 0;
      if (!rail || !bar) return;
      const max = rail.scrollWidth - rail.clientWidth;
      const ratio = rail.clientWidth / rail.scrollWidth;
      const progress = max > 0 ? rail.scrollLeft / max : 0;
      bar.style.width = `${Math.max(ratio, 0.08) * 100}%`;
      bar.style.transform = `translateX(${progress * (1 / Math.max(ratio, 0.08) - 1) * 100}%)`;
      setCanScroll({ left: rail.scrollLeft > 4, right: rail.scrollLeft < max - 4 });
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  function nudge(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section aria-label={title} className="border-b border-stone py-12">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-4 md:px-8">
        <div>
          {meta ? <p className="pk-micro text-slate-ink">{meta}</p> : null}
          <h2 className="pk-h1 mt-2">{title}</h2>
        </div>
        <div className="hidden gap-1 md:flex">
          <button type="button" onClick={() => nudge(-1)} disabled={!canScroll.left} className="pk-micro size-12 border border-stone transition-colors hover:border-navy disabled:opacity-40" aria-label="Scroll back">
            ←
          </button>
          <button type="button" onClick={() => nudge(1)} disabled={!canScroll.right} className="pk-micro size-12 border border-stone transition-colors hover:border-navy disabled:opacity-40" aria-label="Scroll forward">
            →
          </button>
        </div>
      </div>
      <ul ref={railRef} className="pk-rail mt-8 flex gap-4 overflow-x-auto px-4 md:gap-6 md:px-8">
        {products.map((p, i) => (
          <li key={p.slug} className={`shrink-0 ${i % 3 === 1 ? "w-[70vw] sm:w-[34vw] lg:w-[22vw] lg:pt-16" : "w-[78vw] sm:w-[40vw] lg:w-[28vw]"}`}>
            <ProductCard product={p} index={i + 1} ratio={i % 3 === 1 ? "3 / 4" : "4 / 5"} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-8 max-w-[1440px] px-4 md:px-8">
        <div className="relative h-px overflow-hidden bg-stone" aria-hidden>
          <span ref={barRef} className="absolute inset-y-0 left-0 block w-1/4 bg-navy" />
        </div>
      </div>
    </section>
  );
}

export function FieldStudy() {
  return (
    <section aria-labelledby="field-title" className="border-b border-stone">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 flex items-baseline justify-between gap-6 border-b border-stone pb-4">
          <p className="pk-micro text-slate-ink">No. 05 // Running editorial strip</p>
          <p className="pk-micro text-slate-ink">Mumbai / Lisbon field study</p>
        </div>
        <div className="grid items-start gap-6 md:grid-cols-[5fr_4fr_5fr] md:gap-8">
          <Plate index={3} tone="stone" ratio="3 / 4" label="Street portrait: Bandra bandstand, 5:40 pm, linen and Match Cap" />
          <div className="flex flex-col gap-6 border border-stone bg-cream p-6 md:mt-24 md:p-8">
            <h2 id="field-title" className="pk-h1">
              Coastal dressing is humidity management disguised as taste.
            </h2>
            <p className="text-sm text-slate-ink">
              Two seafronts, one small bag: two Club Tees, the Sunday Overshirt, the Leisure Short and a cap that folds flat into a pocket. The linen creased on the
              flight and never uncreased. By the third day it looked better than it did in the shop.
            </p>
            <Link to="/journal/$slug" params={{ slug: "field-study-bandra-to-lisbon" }} className="pk-button-type pk-link w-fit pb-1">
              Read the field study →
            </Link>
          </div>
          <Plate index={4} tone="navy" ratio="4 / 5" label="Street portrait: Cais do Sodré, 6:10 pm, the Leisure Short" className="md:mt-40" />
        </div>
      </div>
    </section>
  );
}
