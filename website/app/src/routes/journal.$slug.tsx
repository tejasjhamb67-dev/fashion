import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { getProduct, type Product } from "@/site/catalog";
import { formatDate } from "@/site/format";
import { getEntry, journal } from "@/site/journal";
import { pageHead, SITE_URL } from "@/site/seo";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { JsonLd } from "@/site/ui/JsonLd";
import { Plate } from "@/site/ui/Plate";
import { ProductCard } from "@/site/ui/ProductCard";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const entry = getEntry(params.slug);
    if (!entry) throw notFound();
    return { slug: entry.slug };
  },
  head: ({ params }) => {
    const entry = getEntry(params.slug);
    if (!entry) return pageHead({ title: "Not found", path: `/journal/${params.slug}`, noindex: true });
    return pageHead({ title: entry.title, description: entry.dek, path: `/journal/${entry.slug}`, type: "article" });
  },
  component: Entry,
});

function Entry() {
  const { slug } = Route.useLoaderData();
  const entry = getEntry(slug)!;
  const products = entry.products.map(getProduct).filter((p): p is Product => Boolean(p));
  const idx = journal.findIndex((e) => e.slug === entry.slug);
  const next = journal[(idx + 1) % journal.length];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.dek,
    datePublished: entry.date,
    author: { "@type": "Organization", name: "PICKLE" },
    publisher: { "@type": "Organization", name: "PICKLE" },
    mainEntityOfPage: `${SITE_URL}/journal/${entry.slug}`,
  };

  const [first, ...body] = entry.body;

  return (
    <article className="mx-auto max-w-[1440px] px-4 md:px-8">
      <JsonLd data={articleLd} />
      <div className="border-b border-stone py-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Journal", to: "/journal" }, { label: entry.title }]} />
      </div>

      <header className="grid gap-8 border-b border-stone py-12 lg:grid-cols-[3fr_2fr]">
        <h1 className="pk-display max-w-[14ch]">{entry.title}</h1>
        <dl className="pk-micro grid h-fit grid-cols-2 gap-y-2 self-end border-t border-stone pt-4 text-slate-ink">
          <dt>Entry</dt>
          <dd className="text-navy">No. {entry.no}</dd>
          <dt>Filed</dt>
          <dd className="text-navy">{formatDate(entry.date)}</dd>
          <dt>Location</dt>
          <dd className="text-navy">{entry.place}</dd>
          <dt>Reading</dt>
          <dd className="text-navy">{entry.readMinutes} min</dd>
        </dl>
      </header>

      <Plate index={1} tone="forest" ratio="21 / 9" label={entry.plates[0]} className="mt-8" />

      <div className="grid gap-10 py-14 lg:grid-cols-[1fr_2fr_1fr]">
        <p className="pk-h3 text-slate-ink">{entry.dek}</p>
        <div className="pk-body-lg space-y-6 leading-relaxed">
          <p className="first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85]">{first}</p>
          {body.slice(0, 1).map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          {entry.pull ? (
            <blockquote className="border-y border-stone py-8">
              <p className="pk-h1">{entry.pull}</p>
            </blockquote>
          ) : null}
          {entry.plates[1] ? <Plate index={2} tone="stone" ratio="4 / 3" label={entry.plates[1]} /> : null}
          {body.slice(1).map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <section aria-labelledby="worn-title" className="border-t border-stone py-12">
          <h2 id="worn-title" className="pk-utility">
            Worn in this entry
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-3">
            {products.map((p, i) => (
              <li key={p.slug} className={i === 1 ? "sm:mt-12" : ""}>
                <ProductCard product={p} index={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link to="/journal/$slug" params={{ slug: next.slug }} className="group flex items-baseline justify-between gap-6 border-t border-stone py-10">
        <span className="pk-micro text-slate-ink">Next entry // No. {next.no}</span>
        <span className="pk-h1 text-right transition-colors duration-[180ms] group-hover:text-cricket">{next.title} →</span>
      </Link>
    </article>
  );
}
