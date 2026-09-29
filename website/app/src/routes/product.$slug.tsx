import { createFileRoute, notFound } from "@tanstack/react-router";

import { getReviews } from "@/lib/api/store.functions";
import { getCategory, getProduct, related } from "@/site/catalog";
import { pageHead, SITE_URL } from "@/site/seo";
import { ProductStage } from "@/site/sections/pdp";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { JsonLd } from "@/site/ui/JsonLd";
import { ProductCard } from "@/site/ui/ProductCard";
import { Reviews } from "@/site/ui/Reviews";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    const res = await getReviews({ data: { slug: product.slug } }).catch(() => ({ reviews: [], available: false }));
    return { slug: product.slug, reviews: res.reviews, reviewsAvailable: res.available };
  },
  head: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) return pageHead({ title: "Not found", path: `/product/${params.slug}`, noindex: true });
    const head = pageHead({
      title: product.name,
      description: `${product.tagline} ${product.material[0]?.value ?? ""}. ₹${product.price.toLocaleString("en-IN")}.`.trim(),
      path: `/product/${product.slug}`,
      type: "product",
    });
    return {
      ...head,
      meta: [
        ...head.meta,
        { property: "product:price:amount", content: String(product.price) },
        { property: "product:price:currency", content: "INR" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug, reviews, reviewsAvailable } = Route.useLoaderData();
  const product = getProduct(slug)!;
  const category = getCategory(product.category);
  const url = `${SITE_URL}/product/${product.slug}`;
  const realReviews = reviews.filter((r) => !r.isSample);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.join(" "),
    sku: product.ref,
    category: category.label,
    brand: { "@type": "Brand", name: "PICKLE" },
    material: product.material[0]?.value,
    url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: product.price,
      highPrice: product.price,
      offerCount: product.colours.length,
      availability: product.sizes.some((s) => s.available) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    // Only real customer reviews count toward rich results; studio samples never do.
    ...(realReviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (realReviews.reduce((s, r) => s + r.rating, 0) / realReviews.length).toFixed(1),
            reviewCount: realReviews.length,
          },
        }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: category.label, item: `${SITE_URL}/shop?category=${category.id}` },
      { "@type": "ListItem", position: 4, name: product.name, item: url },
    ],
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 md:px-8">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="py-6">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/shop" },
            { label: category.label, to: "/shop", search: { category: category.id } },
            { label: product.name },
          ]}
        />
      </div>

      <ProductStage key={product.slug} product={product} reviews={reviews} />

      <div className="mt-24 border-t border-stone pt-12">
        <Reviews key={product.slug} slug={product.slug} productName={product.name} initial={reviews} available={reviewsAvailable} />
      </div>

      <section aria-labelledby="related-title" className="mt-24 border-t border-stone pt-10">
        <div className="flex items-baseline justify-between">
          <h2 id="related-title" className="pk-utility">
            Worn with
          </h2>
          <p className="pk-micro text-slate-ink">Pairs from the range</p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {related(product).map((p, i) => (
            <li key={p.slug} className={i === 1 ? "sm:mt-16" : ""}>
              <ProductCard product={p} index={i + 1} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
