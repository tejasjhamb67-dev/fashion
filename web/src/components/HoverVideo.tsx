"use client";

import { useEffect, useRef } from "react";

/** Plays on hover (desktop) or while in view (touch). Poster shows until then. */
export function HoverVideo({ src, poster, className, active }: { src: string; poster: string; className?: string; active?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const touch = window.matchMedia("(hover: none)").matches;
    if (!touch) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.6 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || active === undefined) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" />;
}
