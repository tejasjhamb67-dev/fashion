import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { bindings } from "../bindings.server";
import { EXPRESS_FEE, getProduct, shippingFor } from "@/site/catalog";

export type Review = {
  id: string;
  author: string;
  city: string | null;
  rating: number;
  fit: string | null;
  title: string;
  body: string;
  isSample: boolean;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  author: string;
  city: string | null;
  rating: number;
  fit: string | null;
  title: string;
  body: string;
  is_sample: number;
  created_at: string;
};

const slugSchema = z.string().min(1).max(80).regex(/^[a-z0-9-]+$/);

function newId(prefix: string, length = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `${prefix}${out}`;
}

export const getReviews = createServerFn({ method: "GET" })
  .validator(z.object({ slug: slugSchema }))
  .handler(async ({ data }): Promise<{ reviews: Review[]; available: boolean }> => {
    const { DB } = bindings();
    if (!DB) return { reviews: [], available: false };
    try {
      const res = await DB.prepare(
        "SELECT id, author, city, rating, fit, title, body, is_sample, created_at FROM reviews WHERE product_slug = ? ORDER BY is_sample ASC, created_at DESC LIMIT 50",
      )
        .bind(data.slug)
        .all<ReviewRow>();
      return {
        available: true,
        reviews: (res.results ?? []).map((r) => ({
          id: r.id,
          author: r.author,
          city: r.city,
          rating: r.rating,
          fit: r.fit,
          title: r.title,
          body: r.body,
          isSample: r.is_sample === 1,
          createdAt: r.created_at,
        })),
      };
    } catch (error) {
      console.error("getReviews failed", error);
      return { reviews: [], available: false };
    }
  });

const reviewInput = z.object({
  slug: slugSchema,
  author: z.string().trim().min(2).max(40),
  city: z.string().trim().max(40).optional().default(""),
  rating: z.number().int().min(1).max(5),
  fit: z.enum(["Runs small", "True to size", "Runs large", "One size fits"]),
  title: z.string().trim().min(3).max(80),
  body: z.string().trim().min(20).max(1200),
  website: z.string().max(0).optional().default(""),
});

export const submitReview = createServerFn({ method: "POST" })
  .validator(reviewInput)
  .handler(async ({ data }): Promise<{ ok: true; review: Review } | { ok: false; error: string }> => {
    if (!getProduct(data.slug)) return { ok: false, error: "That product does not exist." };
    const { DB } = bindings();
    if (!DB) return { ok: false, error: "Reviews are resting. Please try again shortly." };
    const id = newId("rv-", 12);
    try {
      await DB.prepare(
        "INSERT INTO reviews (id, product_slug, author, city, rating, fit, title, body, is_sample) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
      )
        .bind(id, data.slug, data.author, data.city || null, data.rating, data.fit, data.title, data.body)
        .run();
      return {
        ok: true,
        review: {
          id,
          author: data.author,
          city: data.city || null,
          rating: data.rating,
          fit: data.fit,
          title: data.title,
          body: data.body,
          isSample: false,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("submitReview failed", error);
      return { ok: false, error: "Your review did not save. Please try again." };
    }
  });

export const subscribe = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().trim().toLowerCase().email().max(120), source: z.string().max(40).optional() }))
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const { DB } = bindings();
    if (!DB) return { ok: false, message: "The register is closed for a moment. Try again shortly." };
    try {
      const res = await DB.prepare("INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)")
        .bind(data.email, data.source ?? "footer")
        .run();
      const inserted = (res.meta?.changes ?? 0) > 0;
      return { ok: true, message: inserted ? "Signed in. Dispatches will follow." : "You are already on the register." };
    } catch (error) {
      console.error("subscribe failed", error);
      return { ok: false, message: "That did not go through. Please try again." };
    }
  });

const orderInput = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,16}$/),
  address: z.string().trim().min(6).max(240),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/),
  delivery: z.enum(["standard", "express"]),
  lines: z
    .array(
      z.object({
        slug: slugSchema,
        colour: z.string().min(1).max(40),
        size: z.string().min(1).max(8),
        qty: z.number().int().min(1).max(9),
      }),
    )
    .min(1)
    .max(30),
});

export type OrderLine = { slug: string; name: string; colour: string; size: string; qty: number; price: number };

export type Order = {
  id: string;
  email: string;
  fullName: string;
  city: string;
  delivery: "standard" | "express";
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
};

export const createOrder = createServerFn({ method: "POST" })
  .validator(orderInput)
  .handler(async ({ data }): Promise<{ ok: true; id: string } | { ok: false; error: string }> => {
    const priced: OrderLine[] = [];
    for (const line of data.lines) {
      const product = getProduct(line.slug);
      if (!product) return { ok: false, error: "An item in your bag is no longer available." };
      if (!product.colours.some((c) => c.name === line.colour)) {
        return { ok: false, error: `${product.name} is no longer made in ${line.colour}.` };
      }
      const size = product.sizes.find((s) => s.label === line.size);
      if (!size || !size.available) return { ok: false, error: `${product.name} in ${line.size} has just sold out.` };
      priced.push({ slug: product.slug, name: product.name, colour: line.colour, size: line.size, qty: line.qty, price: product.price });
    }
    const subtotal = priced.reduce((sum, l) => sum + l.price * l.qty, 0);
    const shipping = shippingFor(subtotal) + (data.delivery === "express" ? EXPRESS_FEE : 0);
    const total = subtotal + shipping;

    const { DB } = bindings();
    if (!DB) return { ok: false, error: "Checkout is resting. Your bag is saved; please try again shortly." };
    const id = newId("PKL-", 6);
    try {
      await DB.prepare(
        "INSERT INTO orders (id, email, full_name, phone, address, city, state, pincode, delivery, lines_json, subtotal, shipping, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
        .bind(
          id,
          data.email,
          data.fullName,
          data.phone,
          data.address,
          data.city,
          data.state,
          data.pincode,
          data.delivery,
          JSON.stringify(priced),
          subtotal,
          shipping,
          total,
        )
        .run();
      return { ok: true, id };
    } catch (error) {
      console.error("createOrder failed", error);
      return { ok: false, error: "Your order did not save. Nothing was charged; please try again." };
    }
  });

type OrderRow = {
  id: string;
  email: string;
  full_name: string;
  city: string;
  delivery: string;
  lines_json: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
};

export const getOrder = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().regex(/^PKL-[A-Z0-9]{6}$/) }))
  .handler(async ({ data }): Promise<Order | null> => {
    const { DB } = bindings();
    if (!DB) return null;
    try {
      const row = await DB.prepare(
        "SELECT id, email, full_name, city, delivery, lines_json, subtotal, shipping, total, status, created_at FROM orders WHERE id = ?",
      )
        .bind(data.id)
        .first<OrderRow>();
      if (!row) return null;
      return {
        id: row.id,
        email: row.email.replace(/^(.).*(@.*)$/, "$1•••$2"),
        fullName: row.full_name.split(" ")[0] ?? row.full_name,
        city: row.city,
        delivery: row.delivery === "express" ? "express" : "standard",
        lines: JSON.parse(row.lines_json) as OrderLine[],
        subtotal: row.subtotal,
        shipping: row.shipping,
        total: row.total,
        status: row.status,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error("getOrder failed", error);
      return null;
    }
  });

