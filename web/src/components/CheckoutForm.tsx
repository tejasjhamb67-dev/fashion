"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FREE_SHIPPING_FROM, getProduct, inr, SHIPPING_FEE } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { ProductImage } from "./ProductImage";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Chandigarh","Andaman and Nicobar Islands","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep"];

export function CheckoutForm() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const shipping = subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_FEE;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    const { data, error } = await supabase.rpc("place_order", {
      payload: {
        customer: { ...f, phone: f.phone.replace(/\s/g, "") },
        items: lines.map((l) => ({ slug: l.slug, colour: l.colour, size: l.size, qty: l.qty })),
      },
    });
    setBusy(false);
    if (error || !data?.[0]) {
      setErr(error?.message ?? "Something went wrong. Please try again.");
      return;
    }
    clear();
    router.push(`/checkout/success?no=${encodeURIComponent(data[0].order_number)}`);
  }

  if (lines.length === 0) {
    return (
      <section className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 pt-24 text-center">
        <h1 className="display text-[56px]">Your bag is empty.</h1>
        <Link href="/shop" className="label rounded-full bg-ink px-7 py-4 text-paper hover:bg-forest">
          Shop the collection
        </Link>
      </section>
    );
  }

  const input =
    "h-12 w-full rounded-none border-b border-ink/25 bg-transparent text-[15px] outline-none transition-colors focus:border-ink placeholder:text-muted";

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-32 pt-28 md:px-8 md:pt-36">
      <h1 className="display text-[52px] md:text-[80px]">Checkout</h1>
      <div className="mt-10 grid gap-12 md:grid-cols-12">
        <form onSubmit={submit} className="space-y-12 md:col-span-7">
          <fieldset className="grid gap-5 md:grid-cols-2">
            <legend className="label mb-5 text-muted">01. Contact</legend>
            <input name="email" type="email" required autoComplete="email" placeholder="Email" className={input} />
            <input name="phone" type="tel" required autoComplete="tel" placeholder="Mobile number" pattern="[0-9+ ]{10,15}" className={input} />
          </fieldset>
          <fieldset className="grid gap-5 md:grid-cols-2">
            <legend className="label mb-5 text-muted">02. Delivery</legend>
            <input name="name" required autoComplete="name" placeholder="Full name" className={`${input} md:col-span-2`} />
            <input name="line1" required autoComplete="address-line1" placeholder="House, building, street" className={`${input} md:col-span-2`} />
            <input name="line2" autoComplete="address-line2" placeholder="Area, landmark (optional)" className={`${input} md:col-span-2`} />
            <input name="city" required autoComplete="address-level2" placeholder="City" className={input} />
            <input name="pincode" required inputMode="numeric" pattern="[1-9][0-9]{5}" autoComplete="postal-code" placeholder="PIN code" className={input} />
            <select name="state" required defaultValue="" className={`${input} md:col-span-2`}>
              <option value="" disabled>
                State
              </option>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <legend className="label mb-5 text-muted">03. Payment</legend>
            <p className="rounded-[6px] bg-paper-2 p-5 text-[14px] text-ink/80">
              Place your order now and we&apos;ll email a secure payment link (UPI, cards, netbanking) to confirm it. Nothing is charged today.
            </p>
          </fieldset>
          <div>
            <button disabled={busy} className="label flex h-14 w-full items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-forest disabled:opacity-60">
              {busy ? "Placing order" : `Place order — ${inr(subtotal + shipping)}`}
            </button>
            <p className="mt-3 text-[13px] text-rust" aria-live="polite">
              {err}
            </p>
          </div>
        </form>

        <aside className="md:col-span-5">
          <div className="rounded-[6px] border border-line p-6 md:sticky md:top-24">
            <p className="label text-muted">Order summary</p>
            <ul className="mt-4">
              {lines.map((l) => {
                const p = getProduct(l.slug)!;
                return (
                  <li key={`${l.slug}-${l.colour}-${l.size}`} className="flex gap-4 border-b border-line py-4">
                    <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-[4px] bg-paper-2">
                      <ProductImage product={p} colour={l.colour} sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-[17px]">{p.name}</p>
                      <p className="text-[13px] text-muted">
                        {l.colour} · {l.size} · ×{l.qty}
                      </p>
                    </div>
                    <span className="text-[14px] tabular-nums">{inr(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{inr(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="tabular-nums">{shipping ? inr(shipping) : "Free"}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-[16px]">
                <dt>Total</dt>
                <dd className="tabular-nums">{inr(subtotal + shipping)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
