import { createFileRoute, Link } from "@tanstack/react-router";

import { formatDate } from "@/site/format";
import { journal } from "@/site/journal";
import { pageHead } from "@/site/seo";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { Plate } from "@/site/ui/Plate";

export const Route = createFileRoute("/journal/")({
  head: () =>
    pageHead({
      title: "Journal",
      description: "Field studies, fabric notes and the occasional rule from the Private Leisure Department.",
      path: "/journal",
    }),
  component: JournalIndex,
});

function JournalIndex() {
  const [lead, ...rest] = journal;
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="border-b border-stone py-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Journal" }]} />
        <h1 className="pk-display mt-6">The Journal</h1>
        <p className="pk-micro mt-4 text-slate-ink">Dispatches // {String(journal.length).padStart(2, "0")} entries</p>
      </div>

      <Link to="/journal/$slug" params={{ slug: lead.slug }} className="group grid gap-8 border-b border-stone py-12 lg:grid-cols-[3fr_2fr] lg:gap-12">
        <Plate index={1} tone="forest" ratio="16 / 10" label={lead.plates[0]} />
        <div className="flex flex-col justify-end">
          <p className="pk-micro text-slate-ink">
            No. {lead.no} // {lead.place} // {formatDate(lead.date)}
          </p>
          <h2 className="pk-h1 mt-4 transition-colors duration-[180ms] group-hover:text-cricket">{lead.title}</h2>
          <p className="pk-h3 mt-4 text-slate-ink">{lead.dek}</p>
          <span className="pk-button-type mt-8 w-fit pb-1">Read, {lead.readMinutes} min →</span>
        </div>
      </Link>

      <ul className="grid gap-x-8 gap-y-14 py-12 md:grid-cols-3">
        {rest.map((entry, i) => (
          <li key={entry.slug} className={i === 1 ? "md:mt-20" : ""}>
            <Link to="/journal/$slug" params={{ slug: entry.slug }} className="group block">
              <Plate index={i + 2} tone={i === 0 ? "stone" : i === 1 ? "cream" : "navy"} ratio="4 / 5" label={entry.plates[0]} />
              <p className="pk-micro mt-4 text-slate-ink">
                No. {entry.no} // {formatDate(entry.date)}
              </p>
              <h2 className="pk-h3 mt-2 not-italic transition-colors duration-[180ms] group-hover:text-cricket">{entry.title}</h2>
              <p className="mt-2 text-sm text-slate-ink">{entry.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
