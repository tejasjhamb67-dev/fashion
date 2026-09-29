import { Link } from "@tanstack/react-router";

import { collections, liveCategories } from "../catalog";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="mt-24 bg-cricket-dark text-chalk">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-10 border-b border-chalk/15 py-14 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <p className="pk-micro text-chalk/60">Dispatch // Irregular, never loud</p>
            <p className="pk-h1 mt-4 max-w-[14ch]">Good clothes. Bad plans. Occasional letters.</p>
          </div>
          <div className="self-end">
            <Newsletter tone="dark" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4">
          <div>
            <h2 className="pk-micro mb-4 text-chalk/60">Category index</h2>
            <ul className="space-y-2">
              {liveCategories().map((cat) => (
                <li key={cat.id}>
                  <Link to="/shop" search={{ category: cat.id }} className="pk-link text-sm">
                    {cat.index} / {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="pk-link text-sm">
                  All pieces
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="pk-micro mb-4 text-chalk/60">Collections</h2>
            <ul className="space-y-2">
              {collections.map((col) => (
                <li key={col.slug}>
                  <Link to="/collections" hash={col.slug} className="pk-link text-sm">
                    {col.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="pk-micro mb-4 text-chalk/60">Store locations</h2>
            <address className="space-y-3 text-sm not-italic text-chalk/85">
              <p>
                Online only, for now.
                <br />
                Studio visits by appointment,
                <br />
                Bandra West, Mumbai 400050.
              </p>
            </address>
          </div>
          <div>
            <h2 className="pk-micro mb-4 text-chalk/60">Company manifest</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="pk-link text-sm">
                  About the department
                </Link>
              </li>
              <li>
                <Link to="/journal" className="pk-link text-sm">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/about" hash="care" className="pk-link text-sm">
                  Shipping, returns and care
                </Link>
              </li>
              <li>
                <Link to="/about" hash="contact" className="pk-link text-sm">
                  Contact the desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-chalk/15 py-6 md:flex-row md:items-center md:justify-between">
          <p className="pk-micro text-chalk/60">© 2026 Pickle Clothing // All rights reserved</p>
          <p className="pk-micro text-chalk/60">Reg. ref. 2026-X // For recreational use only</p>
        </div>
      </div>
    </footer>
  );
}
