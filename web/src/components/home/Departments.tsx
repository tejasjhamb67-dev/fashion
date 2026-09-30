"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, products } from "@/lib/catalog";
import { HoverVideo } from "../HoverVideo";
import { Reveal } from "../Reveal";

export function Departments() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-28 md:px-8 md:pb-40">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <p className="label text-muted">02. Departments</p>
          <h2 className="display mt-4 text-[48px] md:text-[72px]">Shop by department</h2>
        </div>
        <Link href="/shop" className="label link-u max-md:hidden">
          View all 13
        </Link>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <Link
              href={`/shop?c=${c.id}`}
              onMouseEnter={() => setActive(c.id)}
              onMouseLeave={() => setActive(null)}
              className="group relative block aspect-[3/4] overflow-hidden rounded-[6px] bg-ink"
            >
              <HoverVideo
                src={c.video}
                poster={c.poster}
                active={active === c.id}
                className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
              <span className="label absolute left-4 top-4 text-paper/80">0{i + 1}</span>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-paper">
                <span className="display text-[28px] md:text-[36px]">{c.label}</span>
                <span className="label pb-1.5 text-paper/80">{products.filter((p) => p.category === c.id).length}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
