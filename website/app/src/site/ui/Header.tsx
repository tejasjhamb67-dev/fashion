import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { liveCategories } from "../catalog";
import { useCart } from "../cart";
import { pad } from "../format";
import { Drawer } from "./Drawer";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const bagLabel = cart.hydrated ? pad(cart.count) : "00";

  return (
    <>
      <a href="#main" className="pk-micro sr-only z-[60] bg-navy px-4 py-3 text-chalk focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <div className="border-b border-stone bg-cream">
        <p className="pk-micro mx-auto flex h-8 max-w-[1440px] items-center justify-center gap-6 overflow-hidden whitespace-nowrap px-4 text-slate-ink">
          <span>Series 01 // Summer 2026</span>
          <span className="hidden md:inline" aria-hidden>
            ·
          </span>
          <span className="hidden md:inline">Complimentary shipping across India over ₹5,000</span>
          <span className="hidden lg:inline" aria-hidden>
            ·
          </span>
          <span className="hidden lg:inline">Made in Kerala, Tiruppur and Mumbai</span>
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b border-stone bg-chalk/95 backdrop-blur-sm">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <nav aria-label="Primary" className="flex items-center">
            <button
              type="button"
              className="pk-utility -ml-3 flex h-12 min-w-12 items-center px-3 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              Menu
            </button>
            <ul className="hidden items-center gap-8 lg:flex">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="pk-utility pk-link py-1"
                    activeProps={{ className: "text-cricket" }}
                    activeOptions={{ exact: false }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/" className="flex flex-col items-center leading-none" aria-label="PICKLE, home">
            <span className="font-serif text-[1.75rem] tracking-[0.02em] md:text-[2rem]">Pickle</span>
          </Link>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={cart.openDrawer}
              className="pk-utility pk-ink-hover -mr-3 flex h-12 min-w-12 items-center gap-1.5 px-3"
              aria-label={`Open bag, ${cart.count} items`}
            >
              Bag <span className="tabular-nums">({bagLabel})</span>
            </button>
          </div>
        </div>
      </header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Index" side="left" widthClass="w-[88vw] max-w-[400px]">
        <nav aria-label="Mobile" className="flex h-full flex-col">
          <ul className="border-b border-stone">
            {NAV.map((item, i) => (
              <li key={item.to} className="border-t border-stone first:border-t-0">
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-16 items-baseline gap-4 px-5 py-4"
                  activeProps={{ className: "text-cricket" }}
                >
                  <span className="pk-micro text-slate-ink">{pad(i + 1)}</span>
                  <span className="font-serif text-3xl">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-5 py-6">
            <p className="pk-micro mb-3 text-slate-ink">Categories</p>
            <ul className="flex flex-wrap gap-2">
              {liveCategories().map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/shop"
                    search={{ category: cat.id }}
                    onClick={() => setMenuOpen(false)}
                    className="pk-micro flex h-11 items-center border border-stone px-4 hover:border-navy"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="pk-micro mt-auto border-t border-stone px-5 py-4 text-slate-ink">Private Leisure Department // Est. 2026</p>
        </nav>
      </Drawer>
    </>
  );
}
