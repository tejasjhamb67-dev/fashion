# PICKLE — storefront

Next.js 16 (App Router) + Tailwind 4 + Motion + Lenis, backed by Supabase, deployed on Vercel.

- `src/lib/catalog.ts` — the 13 SS25 products (prices, colours, sizes, specs). Mirrored in Supabase `products`.
- `src/lib/media.ts` — product galleries and the lookbook (`public/p/*.webp`, cut from the SS25 boards).
- `public/media/` — hero (beach walk), store film (boutique), department and craft loops.
- Supabase: `products`, `reviews` (public read / public insert, `is_sample` rows are seeded examples), `subscribers` (insert only),
  `orders` (no public access; created only through the `place_order(payload)` RPC, which re-prices every line server-side).

```bash
cp .env.example .env.local   # fill the Supabase URL + publishable key
npm install && npm run dev
```
