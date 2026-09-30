"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { inr, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";
import { Swatch } from "./Swatch";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [colour, setColour] = useState(product.colours[0].name);
  const [hover, setHover] = useState(false);
  const { add } = useCart();
  const hasAlt = (product.images[colour]?.length ?? 0) > 1;
  const quickSize = product.sizes.length === 1 ? product.sizes[0] : null;

  return (
    <div className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link href={`/product/${product.slug}?colour=${encodeURIComponent(colour)}`} className="relative block aspect-[4/5] overflow-hidden rounded-[6px] bg-paper-2">
        <ProductImage product={product} colour={colour} priority={priority} className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
        {hasAlt && (
          <motion.div className="absolute inset-0" initial={false} animate={{ opacity: hover ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <ProductImage product={product} colour={colour} index={1} />
          </motion.div>
        )}
        {product.tag && (
          <span className="label absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[10px] text-ink backdrop-blur">{product.tag}</span>
        )}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          {quickSize ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                add({ slug: product.slug, colour, size: quickSize });
              }}
              className="label w-full rounded-full bg-ink py-3 text-paper transition-colors hover:bg-forest"
            >
              Quick add
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-full bg-paper/95 p-1 pl-4 backdrop-blur">
              <span className="label text-muted">Quick add</span>
              <div className="flex">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.preventDefault();
                      add({ slug: product.slug, colour, size: s });
                    }}
                    className="h-8 min-w-8 rounded-full px-2 text-[12px] transition-colors hover:bg-ink hover:text-paper"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link href={`/product/${product.slug}`} className="font-serif text-[19px] leading-tight">
            {product.name}
          </Link>
          <div className="mt-2 flex gap-1.5">
            {product.colours.map((c) => (
              <button key={c.name} aria-label={c.name} onMouseEnter={() => setColour(c.name)} onClick={() => setColour(c.name)} className="p-0.5">
                <Swatch colour={c} size={11} ring={c.name === colour} />
              </button>
            ))}
          </div>
        </div>
        <span className="text-[14px] tabular-nums">{inr(product.price)}</span>
      </div>
    </div>
  );
}
