import { Link } from "@tanstack/react-router";

import { FREE_SHIPPING_THRESHOLD, getProduct } from "../catalog";
import { lineKey, useCart } from "../cart";
import { formatPrice, pad } from "../format";
import { Drawer } from "./Drawer";
import { QtyStepper } from "./QtyStepper";

export function CartDrawer() {
  const cart = useCart();
  const remaining = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  return (
    <Drawer
      open={cart.drawerOpen}
      onClose={cart.closeDrawer}
      title={`Your bag (${pad(cart.count)})`}
      footer={
        cart.lines.length > 0 ? (
          <div className="space-y-4 p-5">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="pk-micro text-slate-ink">Subtotal</dt>
                <dd className="pk-price">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="pk-micro text-slate-ink">Shipping</dt>
                <dd className="pk-price">{cart.shipping === 0 ? "Complimentary" : formatPrice(cart.shipping)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              onClick={cart.closeDrawer}
              className="pk-button-type flex h-12 w-full items-center justify-between bg-navy px-5 text-chalk transition-colors duration-[180ms] ease-out hover:bg-cricket"
            >
              <span>Checkout</span>
              <span className="pk-price">{formatPrice(cart.total)}</span>
            </Link>
            <Link to="/cart" onClick={cart.closeDrawer} className="pk-micro pk-link mx-auto block w-fit py-2 text-slate-ink">
              View full bag
            </Link>
          </div>
        ) : null
      }
    >
      {cart.lines.length === 0 ? (
        <div className="flex h-full flex-col items-start justify-center gap-5 p-8">
          <p className="pk-micro text-slate-ink">Bag: 00 items</p>
          <p className="pk-h3">Nothing in here yet. Plenty of time.</p>
          <Link to="/shop" onClick={cart.closeDrawer} className="pk-button-type pk-link pb-1">
            Browse the catalogue →
          </Link>
        </div>
      ) : (
        <div>
          <p className="pk-micro border-b border-stone bg-cream px-5 py-3 text-slate-ink">
            {remaining > 0 ? `${formatPrice(remaining)} from complimentary shipping` : "Shipping is on us"}
          </p>
          <ul>
            {cart.lines.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              const key = lineKey(line);
              const colour = product.colours.find((c) => c.name === line.colour);
              const fresh = cart.lastAdded === key;
              return (
                <li key={key} className={`flex gap-4 border-b border-stone p-5 ${fresh ? "pk-fade" : ""}`}>
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={cart.closeDrawer}
                    className="pk-plate relative block w-20 shrink-0"
                    style={{ aspectRatio: "4 / 5" }}
                    aria-label={product.name}
                  >
                    <span
                      className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy/10"
                      style={{ backgroundColor: colour?.hex }}
                      aria-hidden
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        onClick={cart.closeDrawer}
                        className="pk-utility pk-ink-hover"
                      >
                        {product.name}
                      </Link>
                      <span className="pk-price shrink-0">{formatPrice(product.price * line.qty)}</span>
                    </div>
                    <p className="pk-micro text-slate-ink">
                      {line.colour} / {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper value={line.qty} onChange={(n) => cart.setQty(key, n)} label={product.name} />
                      <button type="button" onClick={() => cart.remove(key)} className="pk-micro pk-link flex h-11 items-center text-slate-ink">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
