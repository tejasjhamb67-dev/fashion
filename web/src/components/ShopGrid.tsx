"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { categories, products, type CategoryId } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "low" | "high" | "new";

export function ShopGrid({ initial }: { initial: CategoryId | "all" }) {
  const [cat, setCat] = useState<CategoryId | "all">(initial);
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    const l = products.filter((p) => cat === "all" || p.category === cat);
    if (sort === "low") return [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...l].sort((a, b) => b.price - a.price);
    if (sort === "new") return [...l].sort((a, b) => Number(b.tag === "New") - Number(a.tag === "New"));
    return l;
  }, [cat, sort]);

  function pick(c: CategoryId | "all") {
    setCat(c);
    const u = new URL(window.location.href);
    if (c === "all") u.searchParams.delete("c");
    else u.searchParams.set("c", c);
    window.history.replaceState(null, "", u);
  }

  const title = cat === "all" ? "The SS25 Collection" : categories.find((c) => c.id === cat)!.label;

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-32 pt-32 md:px-8 md:pt-40">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="label text-muted">Shop — {list.length} pieces</p>
          <AnimatePresence mode="wait">
            <motion.h1
              key={title}
              className="display mt-4 text-[52px] md:text-[96px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.h1>
          </AnimatePresence>
        </div>
        <p className="max-w-sm text-[15px] text-muted">Old references, new attitude. Thirteen pieces for long days, cut in cotton, linen and French terry.</p>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mt-10 flex items-center justify-between gap-4 border-y border-line bg-paper/85 px-4 py-3 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {[{ id: "all" as const, label: "All" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c.id)}
              className={`label shrink-0 rounded-full border px-4 py-2 transition-colors ${
                cat === c.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="label flex shrink-0 items-center gap-2 text-muted">
          <span className="max-sm:hidden">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="label cursor-pointer bg-transparent text-ink outline-none">
            <option value="featured">Featured</option>
            <option value="new">New in</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>

      <motion.div layout className="mt-8 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.04 }}
            >
              <ProductCard product={p} priority={i < 4} />
            </motion.div>
          ))}
          {cat === "all" && (
            <motion.a
              key="editorial"
              layout
              href="/product/match-cap?colour=Cream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group relative hidden overflow-hidden rounded-[6px] md:col-span-2 md:block lg:col-span-3"
            >
              <Image src="/p/cap_life2.webp" alt="Match Cap in Cream, worn by the sea" fill sizes="75vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 text-paper">
                <p className="label">Same cap, different days</p>
                <p className="display mt-3 text-[56px]">The Match Cap</p>
                <p className="label link-u mt-4 inline-block">Shop the Cream →</p>
              </div>
            </motion.a>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
