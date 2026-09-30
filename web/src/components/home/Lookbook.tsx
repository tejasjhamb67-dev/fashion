"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "motion/react";
import { lookbook } from "@/lib/media";

export function Lookbook() {
  const track = useRef<HTMLDivElement>(null);
  return (
    <section className="py-28 md:py-40">
      <div className="mx-auto mb-10 flex max-w-[1600px] items-end justify-between px-4 md:px-8">
        <div>
          <p className="label text-muted">05. Same cap, different days</p>
          <h2 className="display mt-4 text-[48px] md:text-[72px]">Lookbook</h2>
        </div>
        <p className="label text-muted max-md:hidden">Drag →</p>
      </div>
      <div ref={track} className="overflow-hidden px-4 md:px-8">
        <motion.div drag="x" dragConstraints={track} dragElastic={0.08} className="flex w-max cursor-grab gap-3 active:cursor-grabbing">
          {lookbook.map((l, i) => {
            const tall = i % 3 !== 1;
            const inner = (
              <figure className={`group relative shrink-0 overflow-hidden rounded-[6px] bg-paper-2 ${tall ? "h-[62vh] w-[44vh]" : "h-[62vh] w-[56vh]"} max-h-[640px]`}>
                <Image src={l.src} alt={l.caption} fill draggable={false} sizes="45vh" className="pointer-events-none object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                <figcaption className="label absolute inset-x-4 bottom-4 flex justify-between text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span>{l.caption}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            );
            return l.slug ? (
              <Link key={i} href={`/product/${l.slug}`} draggable={false}>
                {inner}
              </Link>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
