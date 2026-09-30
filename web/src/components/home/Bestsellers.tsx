import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";

const picks = ["club-tee", "linen-shirt", "tennis-polo", "sunday-short", "hotel-tee", "rugby-tee", "linen-trouser", "bowling-shirt"];

export function Bestsellers() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-28 md:px-8 md:pb-40">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <p className="label text-muted">03. Most worn</p>
          <h2 className="display mt-4 text-[48px] md:text-[72px]">The members’ favourites</h2>
        </div>
        <Link href="/shop" className="label link-u max-md:hidden">
          Shop all
        </Link>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4">
        {picks.map((s, i) => (
          <Reveal key={s} delay={(i % 4) * 0.06}>
            <ProductCard product={getProduct(s)!} />
          </Reveal>
        ))}
      </div>
      <Link href="/shop" className="label mt-12 flex w-full justify-center rounded-full border border-ink py-4 transition-colors hover:bg-ink hover:text-paper md:hidden">
        Shop all
      </Link>
    </section>
  );
}
