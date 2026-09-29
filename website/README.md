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

## The film

`film/linen_film.py` renders the home-page film from scratch (NumPy + Pillow, encoded
with FFmpeg): a woven plain-weave linen height field, raking late-day light with
cast shadows, a slow camera push that ends on six rows of cricket-green stitching.

    python3 film/linen_film.py film master.mp4 1920 1080 24 14
    python3 film/linen_film.py still cover_%t.png 0.8 2400 1600

The master is cut into three chapters (frames 0-112, 112-224, 224-335) so each
chapter starts on the previous chapter's last frame, then encoded to
`public/assets/world/scene-0N.mp4` (1600px, CRF 25) and `scene-0N-mobile.mp4` (600p).
