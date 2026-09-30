"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { getProduct, inr } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Swatch } from "../Swatch";
import { Reveal } from "../Reveal";

const tiles = [
  { n: "01", label: "Front", src: "/p/cap_front.webp" },
  { n: "02", label: "Back", src: "/p/cap_back.webp" },
  { n: "03", label: "Embroidery", src: "/p/cap_emb.webp" },
  { n: "04", label: "Hardware", src: "/p/cap_hw.webp" },
];

export function Signature() {
  const cap = getProduct("match-cap")!;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const [colour, setColour] = useState(cap.colours[0].name);
  const { add } = useCart();

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-4 pb-28 md:px-8 md:pb-40">
      <div className="grid gap-3 md:grid-cols-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] md:col-span-6 md:aspect-auto md:min-h-[88vh]">
          <motion.div className="absolute inset-[-8%_0]" style={{ y }}>
            <Image src="/p/cap_life.webp" alt="Match Cap in Forest, worn" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </motion.div>
          <div className="absolute left-5 top-5 text-paper md:left-8 md:top-8">
            <p className="display text-[44px] md:text-[64px]">PICKLE</p>
            <p className="label mt-1 border-b border-paper/70 pb-3">Match Cap</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:col-span-6">
          {tiles.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08} className="group relative aspect-square overflow-hidden rounded-[6px] bg-paper-2">
              <Image src={t.src} alt={`Match Cap, ${t.label}`} fill sizes="25vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
              <p className={`label absolute left-4 top-4 ${i > 1 ? "text-paper" : "text-ink"}`}>
                {t.n}. {t.label}
              </p>
            </Reveal>
          ))}

          <div className="col-span-2 grid gap-8 rounded-[6px] border border-line p-6 md:grid-cols-2 md:p-8">
            <div>
              <p className="label text-muted">05. Specifications</p>
              <dl className="mt-5 grid grid-cols-[6.5rem_1fr] gap-y-2 font-serif text-[16px]">
                {[
                  ["Fabric", cap.fabric],
                  ["Fit", cap.fit],
                  ["Construction", cap.construction],
                  ["Detail", cap.graphic],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <div>
                <p className="label text-muted">06. Colours</p>
                <div className="mt-5 flex flex-wrap gap-4">
                  {cap.colours.map((c) => (
                    <button key={c.name} onClick={() => setColour(c.name)} className="flex items-center gap-2 text-[13px]">
                      <Swatch colour={c} size={16} ring={c.name === colour} />
                      <span className={c.name === colour ? "" : "text-muted"}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => add({ slug: cap.slug, colour, size: "One size" })}
                  className="label flex-1 rounded-full bg-ink py-4 text-paper transition-colors hover:bg-forest"
                >
                  Add to bag — {inr(cap.price)}
                </button>
                <Link href="/product/match-cap" className="label link-u shrink-0 py-2">
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
