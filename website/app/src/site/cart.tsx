import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { getProduct, shippingFor } from "./catalog";

export type CartLine = {
  slug: string;
  colour: string;
  size: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  hydrated: boolean;
  drawerOpen: boolean;
  lastAdded: string | null;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const STORAGE_KEY = "pickle.bag.v1";
const MAX_QTY = 9;

export function lineKey(line: Pick<CartLine, "slug" | "colour" | "size">): string {
  return `${line.slug}::${line.colour}::${line.size}`;
}

/** Drops anything the catalogue no longer sells, so a stale bag can never price wrong. */
function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { slug, colour, size, qty } = item as Record<string, unknown>;
    if (typeof slug !== "string" || typeof colour !== "string" || typeof size !== "string") continue;
    const product = getProduct(slug);
    if (!product) continue;
    if (!product.colours.some((c) => c.name === colour)) continue;
    const sizeOpt = product.sizes.find((s) => s.label === size);
    if (!sizeOpt || !sizeOpt.available) continue;
    const n = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(qty) || 1)));
    out.push({ slug, colour, size, qty: n });
  }
  return out;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const skipWrite = useRef(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(sanitize(JSON.parse(stored)));
    } catch {
      // Storage blocked or corrupt: start with an empty bag.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Non-fatal: the bag still works for this visit.
    }
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    const key = lineKey(line);
    setLines((prev) => {
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      }
      return [...prev, { ...line, qty: Math.min(MAX_QTY, qty) }];
    });
    setLastAdded(key);
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => lineKey(l) !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    const shipping = shippingFor(subtotal);
    return {
      lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      hydrated,
      drawerOpen,
      lastAdded,
      add,
      setQty,
      remove,
      clear,
      openDrawer,
      closeDrawer,
    };
  }, [lines, hydrated, drawerOpen, lastAdded, add, setQty, remove, clear, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { MAX_QTY };
