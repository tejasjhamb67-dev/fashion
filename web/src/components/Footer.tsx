import Link from "next/link";
import { categories } from "@/lib/catalog";
import { Newsletter } from "./Newsletter";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="bg-forest-2 text-paper">
      <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-20 md:px-8">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="label text-paper/60">Membership</p>
            <p className="display mt-4 max-w-sm text-[40px]">A club for long days. Good clothes. Better company.</p>
            <div className="mt-8">
              <Newsletter dark />
            </div>
          </div>
          <div>
            <p className="label text-paper/60">Shop</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li><Link className="link-u" href="/shop">All</Link></li>
              {categories.map((c) => (
                <li key={c.id}><Link className="link-u" href={`/shop?c=${c.id}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-paper/60">Help</p>
            <ul className="mt-4 space-y-2 text-[14px] text-paper/85">
              <li>Free shipping over ₹3,000</li>
              <li>Easy 14-day exchanges</li>
              <li>Dispatch in 2 working days</li>
              <li><a className="link-u" href="mailto:hello@pickle.club">hello@pickle.club</a></li>
            </ul>
          </div>
          <div>
            <p className="label text-paper/60">The Club</p>
            <ul className="mt-4 space-y-2 text-[14px] text-paper/85">
              <li>Bombay — 19°04′N</li>
              <li><a className="link-u" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-24 overflow-hidden">
          <Wordmark className="block text-center text-[25vw] leading-[0.8] text-paper/95" />
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-paper/15 pt-6 text-[12px] text-paper/60">
          <span>© {new Date().getFullYear()} PICKLE Athletic Club</span>
          <span>Clothes for longer days.</span>
        </div>
      </div>
    </footer>
  );
}
