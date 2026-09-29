import { createFileRoute, Link } from "@tanstack/react-router";

import { collections, getProduct, type Product } from "@/site/catalog";
import { formatPrice, pad } from "@/site/format";
import { pageHead } from "@/site/seo";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { Plate } from "@/site/ui/Plate";
import { ProductCard } from "@/site/ui/ProductCard";
import { Stamp } from "@/site/ui/Stamp";

export const Route = createFileRoute("/collections")({
  head: () =>
    pageHead({
      title: "Collections",
      description: "Seasonal lookbooks from PICKLE: Series 01 Match Day, Vol. 01 The Off-Season, and Linen Hours.",
      path: "/collections",
    }),
  component: Collections,
});

function Collections() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="border-b border-stone py-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collections" }]} />
        <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr] md:items-end">
          <h1 className="pk-display">Lookbooks</h1>
          <p className="max-w-[40ch] text-slate-ink">Three edits of the same small wardrobe. Each one is a way of packing for a slow week.</p>
        </div>
        <nav aria-label="Collections" className="mt-8 flex flex-wrap gap-2">
          {collections.map((col) => (
            <a key={col.slug} href={`#${col.slug}`} className="pk-micro flex h-11 items-center border border-stone px-4 transition-colors hover:border-navy">
              {col.index} / {col.title}
            </a>
          ))}
        </nav>
      </div>

      {collections.map((col, ci) => {
        const items = col.products.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p));
        if (items.length === 0) return null;
        const total = items.reduce((s, p) => s + p.price, 0);
        const flip = ci % 2 === 1;
        return (
          <section key={col.slug} id={col.slug} aria-labelledby={`${col.slug}-title`} className="scroll-mt-20 border-b border-stone py-16">
            <div className={`grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <Plate index={ci + 1} tone={ci === 0 ? "forest" : ci === 1 ? "stone" : "navy"} ratio="16 / 10" label={`Lookbook opener: ${col.title}`} />
              <div className="flex flex-col justify-between gap-8">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Stamp>No. {col.index}</Stamp>
                    <Stamp>{col.season}</Stamp>
                  </div>
                  <h2 id={`${col.slug}-title`} className="pk-h1 mt-6">
                    {col.title}
                  </h2>
                  <p className="pk-h3 mt-4">{col.intro}</p>
                  <p className="mt-4 text-slate-ink">{col.body}</p>
                </div>
                <dl className="pk-micro grid grid-cols-2 border-l border-t border-stone">
                  <div className="border-b border-r border-stone p-3">
                    <dt className="text-slate-ink">Pieces</dt>
                    <dd className="mt-1 text-navy">{pad(items.length)}</dd>
                  </div>
                  <div className="border-b border-r border-stone p-3">
                    <dt className="text-slate-ink">The full edit</dt>
                    <dd className="pk-price mt-1 text-navy">{formatPrice(total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <ul className="pk-rail -mx-4 mt-10 flex gap-4 overflow-x-auto px-4 md:-mx-8 md:gap-6 md:px-8">
              {items.map((p, i) => (
                <li key={p.slug} className={`w-[72vw] shrink-0 sm:w-[40vw] lg:w-[23vw] ${i % 2 === 1 ? "lg:mt-12" : ""}`}>
                  <ProductCard product={p} index={i + 1} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="py-16 text-center">
        <Link to="/shop" className="pk-button-type pk-link pb-1">
          See every piece in the catalogue →
        </Link>
      </div>
    </div>
  );
}
