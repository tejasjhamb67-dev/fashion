"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/catalog";
import { Wordmark } from "./Wordmark";

export function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const menu = menuAt === pathname;
  const setMenu = (v: boolean) => setMenuAt(v ? pathname : null);
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          overHero ? "text-paper" : "border-b border-line bg-paper/80 text-ink backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <nav className="flex items-center gap-7">
            <button className="label md:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
              Menu
            </button>
            <Link href="/shop" className="label link-u max-md:hidden">
              Shop all
            </Link>
            {categories.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/shop?c=${c.id}`} className="label link-u max-lg:hidden">
                {c.label}
              </Link>
            ))}
          </nav>
          <Link href="/" aria-label="PICKLE home" className="text-[26px] leading-none">
            <Wordmark />
          </Link>
          <div className="flex items-center justify-end gap-7">
            <Link href="/#club" className="label link-u max-md:hidden">
              The Club
            </Link>
            <button onClick={() => setOpen(true)} className="label flex items-center gap-2">
              Bag
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] tabular-nums ${
                  overHero ? "bg-paper text-ink" : "bg-ink text-paper"
                }`}
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-paper px-4 pb-10 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-12 items-center justify-between">
              <Wordmark className="text-[24px]" />
              <button className="label" onClick={() => setMenu(false)}>
                Close
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2">
              {[{ href: "/shop", label: "Shop all" }, ...categories.map((c) => ({ href: `/shop?c=${c.id}`, label: c.label })), { href: "/#club", label: "The Club" }].map(
                (l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={l.href} className="display text-[44px]">
                      {l.label}
                    </Link>
                  </motion.div>
                ),
              )}
            </nav>
            <p className="label mt-auto text-muted">Clothes for longer days.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
