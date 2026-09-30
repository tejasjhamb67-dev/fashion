import { products, type Product } from "@/lib/catalog";
import { ProductCard } from "../ProductCard";

const pairs: Record<string, string[]> = {
  tops: ["match-cap", "sunday-short", "linen-trouser", "beach-tote"],
  shirts: ["club-tee", "linen-trouser", "match-cap", "sunday-short"],
  bottoms: ["linen-shirt", "tennis-polo", "match-cap", "club-tee"],
  accessories: ["club-tee", "linen-shirt", "sunday-short", "tennis-polo"],
};

export function CompleteTheLook({ product }: { product: Product }) {
  const list = pairs[product.category].filter((s) => s !== product.slug).map((s) => products.find((p) => p.slug === s)!).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-28 md:px-8 md:py-40">
      <p className="label text-muted">Wear it with</p>
      <h2 className="display mt-4 text-[48px] md:text-[64px]">Complete the look</h2>
      <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
