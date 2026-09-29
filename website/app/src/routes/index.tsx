import { createFileRoute, Link } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { FILM_READY, scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import { products } from "@/site/catalog";
import { journal } from "@/site/journal";
import { formatDate } from "@/site/format";
import { pageHead } from "@/site/seo";
import { CategoryNavigator, FieldStudy, Hero, MatchCapShowcase, ProductRail, WorldStatement } from "@/site/sections/home";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "PICKLE",
      description:
        "Caps, heavyweight tees, tailored shorts and Belgian linen for the long Indian summer. Series 01 // Summer 2026, made in Kerala, Tiruppur and Mumbai.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);
  return (
    <>
      <Hero />
      {FILM_READY ? (
        <section aria-label="Series 01 film">
          <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
        </section>
      ) : null}
      <MatchCapShowcase />
      <CategoryNavigator />
      <ProductRail title="The initial run" meta="Series 01 // Initial run" products={[...featured, ...rest.slice(0, 3)]} />
      <WorldStatement />
      <FieldStudy />
      <section aria-labelledby="journal-title" className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
        <div className="flex items-baseline justify-between border-b border-stone pb-4">
          <h2 id="journal-title" className="pk-utility">
            From the journal
          </h2>
          <Link to="/journal" className="pk-micro pk-link text-slate-ink">
            All entries
          </Link>
        </div>
        <ol>
          {journal.slice(0, 3).map((entry) => (
            <li key={entry.slug} className="border-b border-stone">
              <Link
                to="/journal/$slug"
                params={{ slug: entry.slug }}
                className="group grid gap-2 py-6 transition-colors duration-[180ms] md:grid-cols-[6rem_1fr_12rem] md:items-baseline md:gap-8"
              >
                <span className="pk-micro text-slate-ink">No. {entry.no}</span>
                <span>
                  <span className="pk-list-title block transition-colors duration-[180ms] group-hover:text-cricket">{entry.title}</span>
                  <span className="mt-1 block text-sm text-slate-ink">{entry.dek}</span>
                </span>
                <span className="pk-micro text-slate-ink md:text-right">
                  {entry.place} // {formatDate(entry.date)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
