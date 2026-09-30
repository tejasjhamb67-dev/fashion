"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function StoreFilm() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [24, 0]);

  return (
    <section ref={ref} id="club" className="relative overflow-hidden">
      <motion.div className="relative h-[90svh] overflow-hidden bg-ink md:h-[110svh]" style={{ scale, borderRadius: radius }}>
        <motion.video
          style={{ y }}
          className="absolute inset-0 h-[124%] w-full -translate-y-[12%] object-cover"
          src="/media/store.mp4"
          poster="/media/store.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-paper">
          <p className="label">04. The Club</p>
          <h2 className="display mt-6 max-w-[14ch] text-[52px] md:text-[112px]">
            A place, <em>not a print.</em>
          </h2>
          <p className="mt-6 max-w-md text-[16px] text-paper/85">Membership is free. Attendance is optional. Dress code: something you can sit in for a very long lunch.</p>
        </div>
      </motion.div>
    </section>
  );
}
