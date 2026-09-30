"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { getProduct } from "./catalog";

export type Line = { slug: string; colour: string; size: string; qty: number };

type Cart = {
  lines: Line[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (l: Omit<Line, "qty">, qty?: number) => void;
  setQty: (i: number, qty: number) => void;
  remove: (i: number) => void;
  clear: () => void;
};

/* A tiny persisted store so the bag survives reloads without hydration mismatches. */
const KEY = "pickle.bag.v1";
const EMPTY: Line[] = [];
let current: Line[] | null = null;
const listeners = new Set<() => void>();

function read(): Line[] {
  if (current) return current;
  try {
    const raw = localStorage.getItem(KEY);
    current = raw ? (JSON.parse(raw) as Line[]).filter((l) => getProduct(l.slug)) : EMPTY;
  } catch {
    current = EMPTY;
  }
  return current;
}

function write(next: Line[]) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const CartCtx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [open, setOpen] = useState(false);

  const add = useCallback((l: Omit<Line, "qty">, qty = 1) => {
    const prev = read();
    const i = prev.findIndex((p) => p.slug === l.slug && p.colour === l.colour && p.size === l.size);
    if (i === -1) write([...prev, { ...l, qty }]);
    else write(prev.map((p, k) => (k === i ? { ...p, qty: Math.min(10, p.qty + qty) } : p)));
    setOpen(true);
  }, []);

  const setQty = useCallback((i: number, qty: number) => {
    const prev = read();
    write(qty <= 0 ? prev.filter((_, k) => k !== i) : prev.map((l, k) => (k === i ? { ...l, qty: Math.min(10, qty) } : l)));
  }, []);

  const remove = useCallback((i: number) => write(read().filter((_, k) => k !== i)), []);
  const clear = useCallback(() => write(EMPTY), []);

  const value = useMemo<Cart>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    return { lines, count, subtotal, open, setOpen, add, setQty, remove, clear };
  }, [lines, open, add, setQty, remove, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
