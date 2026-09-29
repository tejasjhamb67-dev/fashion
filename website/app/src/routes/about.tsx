import { createFileRoute, Link } from "@tanstack/react-router";

import { pageHead } from "@/site/seo";
import { Breadcrumbs } from "@/site/ui/Breadcrumbs";
import { Plate } from "@/site/ui/Plate";
import { PcMark, Stamp } from "@/site/ui/Stamp";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About the department",
      description: "PICKLE is a contemporary lifestyle label blending streetwear, cricket leisure and natural Indian summer dressing. Familiar object, unexpected treatment.",
      path: "/about",
    }),
  component: About,
});

const RULES = [
  ["No front logos bigger than a thumbnail", "Blind embroidery, woven tabs, a small emblem. The garment is the branding."],
  ["One loud graphic per season", "This season it is the Department seal on the back of a tee. Everything else is quiet."],
  ["Weight over adjectives", "We would rather tell you 260 GSM than tell you premium."],
  ["Made to crease, fade and soften", "Linen, washed cotton and raw brass that look better with use."],
  ["No countdowns, no spinning wheels", "If something is a small run, we say so once. That is it."],
];

function About() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <div className="border-b border-stone py-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
      </div>

      <section className="grid gap-10 border-b border-stone py-16 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div>
          <div className="flex flex-wrap gap-2">
            <Stamp>Pickle Leisure Guild</Stamp>
            <Stamp>Est. 2026 // Mumbai</Stamp>
          </div>
          <h1 className="pk-display mt-8 max-w-[14ch]">Familiar object. Unexpected treatment.</h1>
        </div>
        <div className="space-y-5 self-end leading-relaxed">
          <p>
            PICKLE makes a small number of things: caps, T-shirts, shorts and linen shirts. They are the clothes you already own, rebuilt with more care than they
            usually get and a little less seriousness.
          </p>
          <p>
            The references are old Test-match caps, colonial club stands, hotel laundry rosters and the Bombay seafront at five in the evening. The fabrics are
            heavy combed cotton, washed Irish linen and Belgian flax, cut in Kerala, Tiruppur, Bengaluru and Mumbai.
          </p>
          <p>We make them for people who buy a garment because the fabric weight, the neck drop and the shoulder are right, and who find the rest of fashion a bit loud.</p>
        </div>
      </section>

      <section aria-labelledby="rules-title" className="grid gap-10 border-b border-stone py-16 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 id="rules-title" className="pk-h1">
            Department rules
          </h2>
          <p className="pk-micro mt-4 text-slate-ink">Issued to all staff // For recreational use only</p>
        </div>
        <ol className="border-t border-stone">
          {RULES.map(([title, body], i) => (
            <li key={title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-stone py-5">
              <span className="pk-micro pt-1 text-slate-ink">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="pk-utility">{title}</p>
                <p className="mt-1 text-sm text-slate-ink">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 border-b border-stone py-16 md:grid-cols-3">
        <Plate index={1} tone="stone" ratio="3 / 4" label="Workshop: cap pattern pieces, Kerala" />
        <Plate index={2} tone="forest" ratio="3 / 4" label="Knitting floor, Tiruppur" className="md:mt-16" />
        <Plate index={3} tone="cream" ratio="3 / 4" label="Linen cutting table, Mumbai" />
      </section>

      <section id="care" aria-labelledby="care-title" className="scroll-mt-24 grid gap-10 border-b border-stone py-16 lg:grid-cols-[2fr_3fr]">
        <h2 id="care-title" className="pk-h1">
          Shipping, returns and care
        </h2>
        <dl className="divide-y divide-stone border-y border-stone">
          {[
            ["Shipping", "Dispatched from Mumbai within 2 working days. Standard delivery in 3 to 6 days across India, complimentary over ₹5,000, otherwise ₹150. Express in 1 to 3 days for ₹250."],
            ["Returns", "Free returns within 14 days on unworn pieces with tags attached. Exchanges for size are handled first."],
            ["Care", "Cold wash, line or flat dry, out of direct sun. Every product page lists the specifics."],
            ["Repairs", "Loose button, pulled seam, tired buckle: write to the desk and we will fix it for the life of the garment."],
          ].map(([term, detail]) => (
            <div key={term} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
              <dt className="pk-micro pt-0.5 text-slate-ink">{term}</dt>
              <dd className="text-sm leading-relaxed">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 grid gap-10 py-16 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 id="contact-title" className="pk-h1">
            The desk
          </h2>
          <PcMark className="mt-8" />
        </div>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>Studio visits by appointment in Bandra West, Mumbai. Orders, sizing and repairs are handled by the same small desk, Monday to Saturday.</p>
          <p className="pk-micro text-slate-ink">Contact details publish at launch.</p>
          <Link to="/shop" className="pk-button-type pk-link inline-block pb-1">
            Meanwhile, the catalogue →
          </Link>
        </div>
      </section>
    </div>
  );
}
