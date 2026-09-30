"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FREE_SHIPPING_FROM, getProduct, inr } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart();
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Your bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-paper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-6">
              <span className="label">Your bag ({lines.reduce((n, l) => n + l.qty, 0)})</span>
              <button className="label link-u" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <div className="border-b border-line px-6 py-4">
              <p className="text-[13px] text-muted">{left > 0 ? `${inr(left)} away from free shipping` : "Free shipping unlocked"}</p>
              <div className="mt-2 h-[2px] bg-line">
                <motion.div className="h-full bg-forest" animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                  <p className="display text-[34px]">Nothing here yet.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="label rounded-full bg-ink px-6 py-3.5 text-paper hover:bg-forest">
                    Shop the collection
                  </Link>
                </div>
              ) : (
                <ul>
                  {lines.map((l, i) => {
                    const p = getProduct(l.slug)!;
                    return (
                      <li key={`${l.slug}-${l.colour}-${l.size}`} className="flex gap-4 border-b border-line py-5">
                        <Link href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-[4px] bg-paper-2">
                          <ProductImage product={p} colour={l.colour} sizes="96px" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <span className="font-serif text-[18px] leading-tight">{p.name}</span>
                            <span className="text-[14px] tabular-nums">{inr(p.price * l.qty)}</span>
                          </div>
                          <span className="mt-1 text-[13px] text-muted">
                            {l.colour} · {l.size}
                          </span>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line">
                              <button aria-label="Decrease" className="h-8 w-8" onClick={() => setQty(i, l.qty - 1)}>
                                −
                              </button>
                              <span className="w-5 text-center text-[13px] tabular-nums">{l.qty}</span>
                              <button aria-label="Increase" className="h-8 w-8" onClick={() => setQty(i, l.qty + 1)}>
                                +
                              </button>
                            </div>
                            <button className="text-[12px] text-muted underline-offset-4 hover:underline" onClick={() => remove(i)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line p-6">
                <div className="flex justify-between">
                  <span className="label">Subtotal</span>
                  <span className="tabular-nums">{inr(subtotal)}</span>
                </div>
                <p className="mt-1 text-[12px] text-muted">Shipping and taxes calculated at checkout.</p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="label mt-5 flex w-full items-center justify-center rounded-full bg-ink py-4 text-paper transition-colors hover:bg-forest"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
