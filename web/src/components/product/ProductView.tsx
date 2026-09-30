"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { categories, FREE_SHIPPING_FROM, inr, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Swatch } from "../Swatch";
import { ProductImage } from "../ProductImage";

export function ProductView({ product, initialColour }: { product: Product; initialColour: string }) {
  const [colour, setColour] = useState(initialColour);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [added, setAdded] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const { add } = useCart();
  const own = product.images[colour];
  const images = own ?? Object.values(product.images)[0] ?? [];
  const shownIn = own ? null : Object.keys(product.images)[0];
  const cat = categories.find((c) => c.id === product.category)!;

  function addToBag() {
    if (!size) {
      setNudge(true);
      setTimeout(() => setNudge(false), 600);
      return;
    }
    add({ slug: product.slug, colour, size });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const specs: [string, string][] = [
    ["Fabric", product.fabric],
    ["Fit", product.fit],
    ["Graphic", product.graphic],
    ["Construction", product.construction],
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-20 md:px-8 md:pt-24">
      <nav className="label flex gap-2 py-4 text-muted">
        <Link href="/shop" className="link-u">Shop</Link>/
        <Link href={`/shop?c=${cat.id}`} className="link-u">{cat.label}</Link>/<span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        {/* Gallery: stacked grid on desktop, swipe rail on mobile */}
        <div className="md:col-span-7">
          <div className="hidden grid-cols-2 gap-3 md:grid">
            {images.length === 0 && (
              <div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-[6px]">
                <ProductImage product={product} colour={colour} />
              </div>
            )}
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setZoom(src)}
                className={`relative overflow-hidden rounded-[6px] bg-paper-2 aspect-[4/5] cursor-zoom-in`}
              >
                <Image src={src} alt={`${product.name}, view ${i + 1}`} fill priority={i < 2} sizes="29vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] hover:scale-[1.03]" />
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <div
              className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4"
              onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth * 0.88)))}
            >
              {(images.length ? images : [null]).map((src, i) => (
                <div key={i} className="relative aspect-[4/5] w-[88%] shrink-0 snap-center overflow-hidden rounded-[6px] bg-paper-2">
                  {src ? <Image src={src} alt={`${product.name}, view ${i + 1}`} fill priority={i === 0} sizes="88vw" className="object-cover" /> : <ProductImage product={product} colour={colour} />}
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <span key={i} className={`h-[3px] rounded-full transition-all ${i === slide ? "w-6 bg-ink" : "w-3 bg-ink/20"}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buy panel */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <div className="flex items-start justify-between gap-4">
              <p className="label text-muted">{product.no}. {cat.label}</p>
              {product.tag && <span className="label rounded-full border border-line px-2.5 py-1 text-[10px]">{product.tag}</span>}
            </div>
            <h1 className="display mt-4 text-[56px] md:text-[76px]">{product.name}</h1>
            <p className="mt-3 font-serif text-[20px] italic text-ink/75">{product.line}</p>
            <p className="mt-6 text-[20px] tabular-nums">{inr(product.price)}</p>
            <p className="text-[12px] text-muted">Inclusive of all taxes</p>

            <div className="mt-8 border-t border-line pt-6">
              <div className="flex justify-between">
                <span className="label">Colour</span>
                <span className="text-[13px] text-muted">
                  {colour}
                  {shownIn && images.length > 0 && <span className="italic"> — photographed in {shownIn}</span>}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.colours.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColour(c.name)}
                    aria-label={c.name}
                    aria-pressed={c.name === colour}
                    className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[13px] transition-colors ${
                      c.name === colour ? "border-ink" : "border-line hover:border-ink/40"
                    }`}
                  >
                    <Swatch colour={c} size={20} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <motion.div className="mt-6" animate={nudge ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.45 }}>
              <div className="flex justify-between">
                <span className={`label ${nudge ? "text-rust" : ""}`}>{nudge ? "Pick a size" : "Size"}</span>
                {product.sizes.length > 1 && (
                  <span className="text-[13px] text-muted">{product.category === "bottoms" ? "Waist, inches" : "Relaxed fit — true to size"}</span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    aria-pressed={s === size}
                    className={`h-12 rounded-full border text-[13px] transition-colors ${product.sizes.length === 1 ? "col-span-5" : ""} ${
                      s === size ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>

            <button
              onClick={addToBag}
              className={`label relative mt-6 flex h-14 w-full items-center justify-center overflow-hidden rounded-full text-paper transition-colors ${added ? "bg-forest" : "bg-ink hover:bg-forest"}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? "a" : "b"} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {added ? "Added to bag ✓" : `Add to bag — ${inr(product.price)}`}
                </motion.span>
              </AnimatePresence>
            </button>
            <p className="mt-3 text-center text-[12px] text-muted">
              Free shipping over {inr(FREE_SHIPPING_FROM)} · Dispatched in 2 working days · 14-day exchanges
            </p>

            <div className="mt-8 border-t border-line pt-6">
              <p className="label text-muted">Specifications</p>
              <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-y-2 font-serif text-[16px]">
                {specs.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k} :</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Accordion title="Description">{product.description}</Accordion>
            <Accordion title="Care">{product.care}</Accordion>
            <Accordion title="Shipping & exchanges">
              Orders over {inr(FREE_SHIPPING_FROM)} ship free across India; otherwise ₹150. Dispatched within two working days. Exchange any unworn piece within 14 days.
            </Accordion>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.button
            className="fixed inset-0 z-50 cursor-zoom-out bg-paper"
            onClick={() => setZoom(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close zoom"
          >
            <Image src={zoom} alt="" fill sizes="100vw" className="object-contain" />
            <span className="label absolute right-6 top-6">Close</span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5" aria-expanded={open}>
        <span className="label">{title}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-[20px] leading-none">
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-6 text-[15px] leading-relaxed text-ink/80">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
