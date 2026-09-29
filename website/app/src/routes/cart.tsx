import { createFileRoute, Link } from "@tanstack/react-router";

import { FREE_SHIPPING_THRESHOLD, getProduct, products } from "@/site/catalog";
import { lineKey, useCart } from "@/site/cart";
import { formatPrice, pad } from "@/site/format";
import { pageHead } from "@/site/seo";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { ProductCard } from "@/site/ui/ProductCard";
import { QtyStepper } from "@/site/ui/QtyStepper";

export const Route = createFileRoute("/cart")({
  head: () => pageHead({ title: "Your bag", path: "/cart", noindex: true }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
      <div className="border-b border-stone py-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bag" }]} />
        <h1 className="pk-display mt-6">Your bag</h1>
        <p className="pk-micro mt-4 text-slate-ink">{cart.hydrated ? `${pad(cart.count)} items` : "Counting"}</p>
      </div>

      {!cart.hydrated ? (
        <div className="grid gap-4 py-10" aria-busy="true" aria-label="Loading bag">
          {[0, 1].map((i) => (
            <div key={i} className="pk-skeleton h-28" />
          ))}
        </div>
      ) : cart.lines.length === 0 ? (
        <div className="py-16">
          <p className="pk-h3">The bag is empty. The weekend is not.</p>
          <Link to="/shop" className="pk-button-type pk-link mt-6 inline-block pb-1">
            Browse the catalogue →
          </Link>
          <ul className="mt-16 grid gap-8 sm:grid-cols-3">
            {products
              .filter((p) => p.featured)
              .slice(0, 3)
              .map((p, i) => (
                <li key={p.slug} className={i === 1 ? "sm:mt-12" : ""}>
                  <ProductCard product={p} index={i + 1} />
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div className="grid gap-12 py-10 lg:grid-cols-[2fr_1fr]">
          <table className="w-full border-collapse">
            <caption className="sr-only">Items in your bag</caption>
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-stone">
                <th scope="col" className="pk-micro py-3 text-left font-normal text-slate-ink">
                  Piece
                </th>
                <th scope="col" className="pk-micro py-3 text-left font-normal text-slate-ink">
                  Quantity
                </th>
                <th scope="col" className="pk-micro py-3 text-right font-normal text-slate-ink">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cart.lines.map((line) => {
                const product = getProduct(line.slug);
                if (!product) return null;
                const key = lineKey(line);
                const colour = product.colours.find((c) => c.name === line.colour);
                return (
                  <tr key={key} className="grid grid-cols-[1fr_auto] gap-y-3 border-b border-stone py-5 md:table-row">
                    <td className="col-span-2 md:py-5">
                      <div className="flex gap-4">
                        <Link to="/product/$slug" params={{ slug: product.slug }} className="pk-plate relative block w-24 shrink-0" style={{ aspectRatio: "4 / 5" }} aria-label={product.name}>
                          <span className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy/10" style={{ backgroundColor: colour?.hex }} aria-hidden />
                        </Link>
                        <div className="space-y-1">
                          <Link to="/product/$slug" params={{ slug: product.slug }} className="pk-utility pk-ink-hover">
                            {product.name}
                          </Link>
                          <p className="pk-micro text-slate-ink">
                            {line.colour} / {line.size}
                          </p>
                          <p className="pk-price">{formatPrice(product.price)}</p>
                          <button type="button" onClick={() => cart.remove(key)} className="pk-micro pk-link flex h-11 items-center text-slate-ink">
                            Remove
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="md:py-5">
                      <QtyStepper value={line.qty} onChange={(n) => cart.setQty(key, n)} label={product.name} />
                    </td>
                    <td className="pk-price self-center text-right md:py-5">{formatPrice(product.price * line.qty)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <aside aria-label="Order summary" className="h-fit border border-stone bg-cream p-6 lg:sticky lg:top-24">
            <h2 className="pk-utility">Summary</h2>
            <dl className="mt-6 space-y-3">
              <div className="flex justify-between">
                <dt className="pk-micro text-slate-ink">Subtotal</dt>
                <dd className="pk-price">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="pk-micro text-slate-ink">Standard shipping</dt>
                <dd className="pk-price">{cart.shipping === 0 ? "Complimentary" : formatPrice(cart.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone-deep pt-3">
                <dt className="pk-utility">Total</dt>
                <dd className="pk-price text-base">{formatPrice(cart.total)}</dd>
              </div>
            </dl>
            <p className="pk-micro mt-4 text-slate-ink">
              {remaining > 0 ? `Add ${formatPrice(remaining)} for complimentary shipping.` : "Complimentary shipping applied."}
            </p>
            <Link
              to="/checkout"
              className="pk-button-type mt-6 flex h-12 w-full items-center justify-center bg-navy text-paper transition-colors duration-[180ms] hover:bg-cricket"
            >
              Proceed to checkout
            </Link>
            <Link to="/shop" className="pk-micro pk-link mx-auto mt-4 block w-fit text-slate-ink">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
