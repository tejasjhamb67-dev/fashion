# PICKLE storefront (Higgsfield site source)

Live at https://pickle-clothing.higgsfield.app (Higgsfield website `pickle-clothing`).

This folder mirrors the files written on top of Higgsfield's `scroll-scrub`
website template (React 19 + TanStack Start on a Cloudflare Worker, D1 database).
The authoritative copy lives in the Higgsfield site repo; these are the PICKLE
files only, not the full template.

- `app/src/site/catalog.ts`: the catalogue (13 products, 4 categories, 3 collections).
- `app/src/site/journal.ts`: journal entries.
- `app/src/routes/*`: pages (home, shop, product, collections, journal, about, cart, checkout, order).
- `app/src/lib/api/store.functions.ts`: server functions for reviews, newsletter and orders (D1).
- `app/migrations/0002_store.sql`: tables plus clearly labelled sample reviews.
- `app/src/scroll-scrub-scenes.ts`: film scene copy; `FILM_READY` flips on once the film is generated.
