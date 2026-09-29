import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { categories, getCategory, liveCategories, products, type CategoryId } from "@/site/catalog";
import { pad } from "@/site/format";
import { pageHead } from "@/site/seo";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { Drawer } from "@/site/ui/Drawer";
import { ProductCard } from "@/site/ui/ProductCard";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A to Z" },
] as const;

type SortId = (typeof SORTS)[number]["id"];
type ShopSearch = { category?: CategoryId; sort?: SortId };

const categoryIds = categories.map((c) => c.id) as string[];
const sortIds = SORTS.map((s) => s.id) as string[];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search.category === "string" && categoryIds.includes(search.category) ? (search.category as CategoryId) : undefined,
    sort: typeof search.sort === "string" && sortIds.includes(search.sort) && search.sort !== "featured" ? (search.sort as SortId) : undefined,
  }),
  head: () =>
    pageHead({
      title: "Shop the catalogue",
      description: "Every PICKLE piece in one place: T-shirts, caps, shorts and linen. Filter by department, sort by price.",
      path: "/shop",
    }),
  component: Shop,
});

function FilterPill({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pk-micro flex h-11 shrink-0 items-center border px-4 transition-colors duration-[180ms] ${
        active ? "border-navy bg-navy text-chalk" : "border-stone hover:border-navy"
      }`}
    >
      {children}
    </button>
  );
}

function Shop() {
  const { category, sort = "featured" } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [sheetOpen, setSheetOpen] = useState(false);

  const setSearch = (next: ShopSearch) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true, resetScroll: false });

  let list = category ? products.filter((p) => p.category === category) : [...products];
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "featured") list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  const heading = category ? getCategory(category).label : "All pieces";
  const cats = liveCategories();

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="grid gap-6 border-b border-stone py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, ...(category ? [{ label: heading }] : [])]} />
          <h1 className="pk-display mt-6">{heading}</h1>
        </div>
        <p className="pk-micro text-slate-ink">
          Showing {pad(list.length)} of {pad(products.length)} // {category ? getCategory(category).note : "Series 01 and Vol. 01"}
        </p>
      </div>

      {/* Desktop filters */}
      <div className="sticky top-16 z-30 -mx-4 hidden items-center justify-between gap-6 border-b border-stone bg-chalk/95 px-4 py-3 backdrop-blur-sm md:-mx-8 md:flex md:px-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <FilterPill active={!category} onClick={() => setSearch({ category: undefined })}>
            All ({pad(products.length)})
          </FilterPill>
          {cats.map((cat) => (
            <FilterPill key={cat.id} active={category === cat.id} onClick={() => setSearch({ category: cat.id })}>
              {cat.label} ({pad(products.filter((p) => p.category === cat.id).length)})
            </FilterPill>
          ))}
        </div>
        <label className="flex items-center gap-3">
          <span className="pk-micro text-slate-ink">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSearch({ sort: e.target.value === "featured" ? undefined : (e.target.value as SortId) })}
            className="pk-micro h-11 border border-stone bg-chalk px-3"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mobile filter trigger */}
      <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between border-b border-stone bg-chalk/95 px-4 backdrop-blur-sm md:hidden">
        <button type="button" onClick={() => setSheetOpen(true)} className="pk-utility flex h-12 items-center" aria-haspopup="dialog">
          Filter and sort
        </button>
        <span className="pk-micro text-slate-ink">{category ? getCategory(category).label : "All"}</span>
      </div>
      <Drawer open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter and sort" side="bottom">
        <div className="space-y-8 p-5">
          <fieldset>
            <legend className="pk-micro mb-3 text-slate-ink">Department</legend>
            <div className="flex flex-wrap gap-2">
              <FilterPill active={!category} onClick={() => setSearch({ category: undefined })}>
                All
              </FilterPill>
              {cats.map((cat) => (
                <FilterPill key={cat.id} active={category === cat.id} onClick={() => setSearch({ category: cat.id })}>
                  {cat.label}
                </FilterPill>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="pk-micro mb-3 text-slate-ink">Sort</legend>
            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <FilterPill key={s.id} active={sort === s.id} onClick={() => setSearch({ sort: s.id === "featured" ? undefined : s.id })}>
                  {s.label}
                </FilterPill>
              ))}
            </div>
          </fieldset>
          <button type="button" onClick={() => setSheetOpen(false)} className="pk-button-type flex h-12 w-full items-center justify-center bg-navy text-chalk">
            Show {pad(list.length)} pieces
          </button>
        </div>
      </Drawer>

      {list.length === 0 ? (
        <div className="py-24">
          <p className="pk-h3">Nothing in this department yet.</p>
          <Link to="/shop" className="pk-button-type pk-link mt-4 inline-block pb-1">
            See everything →
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 py-10 sm:grid-cols-2 lg:grid-cols-12">
          {list.map((p, i) => {
            // Structured asymmetry: a 5/4/3 rhythm on desktop, with the wide card offset.
            const pattern = i % 5;
            const span =
              pattern === 0
                ? "lg:col-span-5"
                : pattern === 1
                  ? "lg:col-span-4 lg:mt-24"
                  : pattern === 2
                    ? "lg:col-span-3"
                    : pattern === 3
                      ? "lg:col-span-4 lg:col-start-2"
                      : "lg:col-span-6 lg:mt-16";
            const ratio = pattern === 2 ? "3 / 4" : pattern === 4 ? "5 / 4" : "4 / 5";
            return (
              <li key={p.slug} className={`${span} ${i % 2 === 1 ? "sm:max-lg:mt-12" : ""}`}>
                <ProductCard product={p} index={i + 1} ratio={ratio} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
