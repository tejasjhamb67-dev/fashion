-- PICKLE storefront schema. Additive only: this database is live.

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_slug TEXT NOT NULL,
  author TEXT NOT NULL,
  city TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  fit TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_sample INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews (product_slug, created_at);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  delivery TEXT NOT NULL,
  lines_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'preview_unpaid',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sample reviews shown until real customer reviews arrive. is_sample = 1 makes
-- the storefront label them as samples; delete these rows at launch.
INSERT OR IGNORE INTO reviews (id, product_slug, author, city, rating, fit, title, body, is_sample, created_at) VALUES
  ('sample-mc-1', 'the-match-cap', 'Sample reviewer', 'Mumbai', 5, 'One size fits', 'Softer than it looks', 'Placeholder review. The linen crown collapses into a bag and recovers on the head; the brass buckle has already started to dull in a nice way.', 1, '2026-06-02 10:00:00'),
  ('sample-mc-2', 'the-match-cap', 'Sample reviewer', 'Goa', 4, 'Runs slightly large', 'Peak is the right length', 'Placeholder review. Shallow peak, good stitching. Wish there was a sand colourway.', 1, '2026-06-09 10:00:00'),
  ('sample-ct-1', 'the-club-tee', 'Sample reviewer', 'Bengaluru', 5, 'True to size', 'The collar stays put', 'Placeholder review. Heavy without being hot. Six washes in and the rib collar has not moved.', 1, '2026-05-28 10:00:00'),
  ('sample-ct-2', 'the-club-tee', 'Sample reviewer', 'Delhi', 4, 'Boxy, as described', 'Size down for a closer fit', 'Placeholder review. Took my usual size and it is properly boxy. Would size down next time.', 1, '2026-06-11 10:00:00'),
  ('sample-hv-1', 'the-heavyweight-tee', 'Sample reviewer', 'Pune', 5, 'True to size', 'Stands away from the body', 'Placeholder review. Feels closer to a light sweatshirt than a tee. Excellent drape.', 1, '2026-06-04 10:00:00'),
  ('sample-ls-1', 'the-leisure-short', 'Sample reviewer', 'Chennai', 5, 'True to size', 'Horn button is a nice touch', 'Placeholder review. The elastic back makes lunch easier and the flat front keeps it looking tailored.', 1, '2026-06-06 10:00:00'),
  ('sample-so-1', 'the-sunday-overshirt', 'Sample reviewer', 'Lisbon', 5, 'Generous, size down', 'Creases beautifully', 'Placeholder review. Wore it open over a tee for a week. Better on day three than day one.', 1, '2026-06-18 10:00:00'),
  ('sample-so-2', 'the-sunday-overshirt', 'Sample reviewer', 'Mumbai', 4, 'Generous, size down', 'Real mother-of-pearl', 'Placeholder review. Lovely fabric. Size down once if you want it as a shirt.', 1, '2026-06-21 10:00:00'),
  ('sample-ut-1', 'the-utility-shirt', 'Sample reviewer', 'Kolkata', 5, 'True to size', 'A summer jacket, basically', 'Placeholder review. Roll the sleeves twice and it replaces a jacket for most evenings.', 1, '2026-06-15 10:00:00'),
  ('sample-mb-1', 'the-member-cap', 'Sample reviewer', 'Hyderabad', 4, 'One size fits', 'Good first cap', 'Placeholder review. Structured, holds its shape, the embroidery is properly raised.', 1, '2026-05-30 10:00:00'),
  ('sample-is-1', 'the-issue-tee', 'Sample reviewer', 'Jaipur', 5, 'True to size', 'Bought three', 'Placeholder review. Plain, heavy, and the hem detail is a nice secret.', 1, '2026-05-25 10:00:00'),
  ('sample-od-1', 'the-off-duty-short', 'Sample reviewer', 'Kochi', 4, 'True to size', 'Goes with everything', 'Placeholder review. Simple drawcord short that works with every tee in the range.', 1, '2026-06-01 10:00:00');
