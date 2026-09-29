import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";

import { createOrder } from "@/lib/api/store.functions";
import { EXPRESS_FEE, getProduct } from "@/site/catalog";
import { useCart } from "@/site/cart";
import { formatPrice, pad } from "@/site/format";
import { pageHead } from "@/site/seo";

export const Route = createFileRoute("/checkout")({
  head: () => pageHead({ title: "Checkout", path: "/checkout", noindex: true }),
  component: Checkout,
});

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

type Errors = Partial<Record<"email" | "fullName" | "phone" | "address" | "city" | "state" | "pincode", string>>;

function validate(fd: FormData): Errors {
  const e: Errors = {};
  const v = (k: string) => String(fd.get(k) ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) e.email = "Enter a complete email address.";
  if (v("fullName").length < 2) e.fullName = "Enter the name for delivery.";
  if (!/^[0-9+\s-]{8,16}$/.test(v("phone"))) e.phone = "Enter a phone number the courier can call.";
  if (v("address").length < 6) e.address = "Enter the full street address.";
  if (v("city").length < 2) e.city = "Enter a city.";
  if (!v("state")) e.state = "Choose a state.";
  if (!/^[1-9][0-9]{5}$/.test(v("pincode"))) e.pincode = "PIN codes are six digits.";
  return e;
}

function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const express = delivery === "express" ? EXPRESS_FEE : 0;
  const total = cart.total + express;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const found = validate(fd);
    setErrors(found);
    setServerError(null);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      document.getElementById(`co-${firstBad}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await createOrder({
        data: {
          email: String(fd.get("email")),
          fullName: String(fd.get("fullName")),
          phone: String(fd.get("phone")),
          address: String(fd.get("address")),
          city: String(fd.get("city")),
          state: String(fd.get("state")),
          pincode: String(fd.get("pincode")),
          delivery,
          lines: cart.lines,
        },
      });
      if (!res.ok) {
        setServerError(res.error);
        setSubmitting(false);
        return;
      }
      await navigate({ to: "/order/$id", params: { id: res.id } });
      cart.clear();
    } catch {
      setServerError("Your order did not go through. Nothing was charged. Please check the details and try again.");
      setSubmitting(false);
    }
  }

  if (!cart.hydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8" aria-busy="true">
        <div className="pk-skeleton h-10 w-64" />
        <div className="pk-skeleton mt-8 h-96" />
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-8">
        <p className="pk-micro text-slate-ink">Checkout</p>
        <h1 className="pk-h1 mt-4">Nothing to check out yet.</h1>
        <Link to="/shop" className="pk-button-type pk-link mt-6 inline-block pb-1">
          Browse the catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone py-10">
        <h1 className="pk-h1">Checkout</h1>
        <p className="pk-micro text-slate-ink">Step 01 of 01 // Details and confirm</p>
      </div>

      <p className="pk-micro mt-6 border border-stone bg-cream px-4 py-3 text-stamp">
        Preview checkout: orders are recorded but no payment is taken yet. Online payment switches on at launch.
      </p>

      <form onSubmit={onSubmit} noValidate className="grid gap-12 py-10 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-10">
          <fieldset className="space-y-5">
            <legend className="pk-utility mb-4">01 / Contact</legend>
            <TextField id="email" label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email} />
            <TextField id="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="pk-utility mb-4">02 / Delivery address</legend>
            <TextField id="fullName" label="Full name" autoComplete="name" error={errors.fullName} />
            <TextField id="address" label="Street address, flat, building" autoComplete="street-address" error={errors.address} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="city" label="City" autoComplete="address-level2" error={errors.city} />
              <TextField id="pincode" label="PIN code" autoComplete="postal-code" inputMode="numeric" maxLength={6} error={errors.pincode} />
            </div>
            <label className="block">
              <span className="pk-micro text-slate-ink">State</span>
              <select
                id="co-state"
                name="state"
                defaultValue=""
                autoComplete="address-level1"
                aria-invalid={Boolean(errors.state) || undefined}
                aria-describedby={errors.state ? "co-state-err" : undefined}
                className={`mt-2 h-12 w-full border bg-chalk px-3 text-sm ${errors.state ? "border-stamp" : "border-stone"}`}
              >
                <option value="" disabled>
                  Choose
                </option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {errors.state ? (
                <span id="co-state-err" className="pk-micro mt-1 block text-stamp">
                  {errors.state}
                </span>
              ) : null}
            </label>
          </fieldset>

          <fieldset>
            <legend className="pk-utility mb-4">03 / Delivery</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["standard", "Standard", "3 to 6 working days", cart.shipping === 0 ? "Complimentary" : formatPrice(cart.shipping)],
                  ["express", "Express", "1 to 3 working days", `+ ${formatPrice(EXPRESS_FEE)}`],
                ] as const
              ).map(([id, label, eta, price]) => (
                <label
                  key={id}
                  className={`flex min-h-16 cursor-pointer items-center justify-between gap-4 border p-4 transition-colors ${
                    delivery === id ? "border-navy bg-stone" : "border-stone hover:border-navy"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" name="delivery" value={id} checked={delivery === id} onChange={() => setDelivery(id)} className="accent-navy" />
                    <span>
                      <span className="pk-utility block">{label}</span>
                      <span className="pk-micro text-slate-ink">{eta}</span>
                    </span>
                  </span>
                  <span className="pk-price">{price}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside aria-label="Order summary" className="h-fit border border-stone bg-paper p-6 lg:sticky lg:top-24">
          <h2 className="pk-utility">Your order ({pad(cart.count)})</h2>
          <ul className="mt-6 divide-y divide-stone border-y border-stone">
            {cart.lines.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              return (
                <li key={`${line.slug}-${line.colour}-${line.size}`} className="flex justify-between gap-4 py-3">
                  <div>
                    <p className="pk-utility">{product.name}</p>
                    <p className="pk-micro text-slate-ink">
                      {line.colour} / {line.size} / × {pad(line.qty)}
                    </p>
                  </div>
                  <p className="pk-price">{formatPrice(product.price * line.qty)}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 space-y-2">
            <div className="flex justify-between">
              <dt className="pk-micro text-slate-ink">Subtotal</dt>
              <dd className="pk-price">{formatPrice(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="pk-micro text-slate-ink">Shipping</dt>
              <dd className="pk-price">{cart.shipping + express === 0 ? "Complimentary" : formatPrice(cart.shipping + express)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone pt-3">
              <dt className="pk-utility">Total</dt>
              <dd className="pk-price text-base">{formatPrice(total)}</dd>
            </div>
          </dl>
          {serverError ? (
            <p role="alert" className="pk-micro mt-4 border border-stone bg-cream p-3 text-stamp">
              {serverError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="pk-button-type mt-6 flex h-12 w-full items-center justify-between bg-navy px-5 text-paper transition-colors duration-[180ms] hover:bg-cricket disabled:opacity-60"
          >
            <span>{submitting ? "Recording your order" : "Place order"}</span>
            <span className="pk-price">{formatPrice(total)}</span>
          </button>
          <p className="pk-micro mt-3 text-slate-ink">No payment is taken in preview. The desk will be in touch to confirm.</p>
        </aside>
      </form>
    </div>
  );
}

function TextField({ id, label, error, ...input }: { id: string; label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="pk-micro text-slate-ink">{label}</span>
      <input
        id={`co-${id}`}
        name={id}
        {...input}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `co-${id}-err` : undefined}
        className={`mt-2 h-12 w-full border bg-chalk px-3 text-base outline-none focus:border-navy ${error ? "border-stamp" : "border-stone"}`}
      />
      {error ? (
        <span id={`co-${id}-err`} className="pk-micro mt-1 block text-stamp">
          {error}
        </span>
      ) : null}
    </label>
  );
}
