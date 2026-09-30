"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const inset = useTransform(scrollYProgress, [0, 0.6], [0, 5]);
  const radius = useTransform(scrollYProgress, [0, 0.6], [0, 18]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div ref={ref} className="relative h-[140svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0 bg-ink" style={{ clipPath: clip }}>
          <motion.video
            style={{ y }}
            className="absolute inset-0 h-full w-full scale-[1.12] object-cover object-[72%_50%] md:object-center"
            autoPlay
            muted
            loop
            playsInline
            poster="/media/hero.jpg"
          >
            <source media="(max-width: 767px)" src="/media/hero-m.mp4" type="video/mp4" />
            <source src="/media/hero.mp4" type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/5 to-black/60" />

          <motion.div style={{ opacity: fade }} className="absolute inset-0 flex flex-col justify-between px-4 pb-6 pt-24 text-paper md:px-8 md:pb-8">
            <div className="flex items-start justify-between">
              <motion.p
                className="label max-w-[14ch] leading-[1.9]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                Traditional shape. Modern attitude.
              </motion.p>
              <motion.p className="label text-right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}>
                SS25 Collection
                <br />
                Bombay — 19°04′N
              </motion.p>
            </div>

            <div>
              <div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <motion.p
                  className="display max-w-[16ch] text-[30px] italic [text-shadow:0_1px_24px_rgb(0_0_0/0.35)] md:text-[40px]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  Clothes for longer days.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
                  <Link
                    href="/shop"
                    className="label group inline-flex items-center gap-3 rounded-full bg-paper px-6 py-4 text-ink transition-colors hover:bg-forest hover:text-paper"
                  >
                    Shop the collection
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </Link>
                </motion.div>
              </div>
              <h1 className="overflow-hidden">
                <motion.span
                  className="display block text-center text-[27vw] leading-[0.78] tracking-[0.02em] md:text-[25.5vw]"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                >
                  PICKLE
                </motion.span>
              </h1>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
