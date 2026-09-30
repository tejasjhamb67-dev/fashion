/** Image galleries per product, cut from the SS25 boards. Order: card, hover, then gallery. */
const g = (...names: string[]) => names.map((n) => `/p/${n}.webp`);

export const galleries: Record<string, string[]> = {
  "club-tee": g("tee_front", "tee_life", "tee_back", "tee_chest", "tee_backg", "tee_neck", "tee_life2", "tee_sleeve"),
  "match-cap": g("cap_front", "cap_life", "cap_back", "match-cap_pack", "cap_emb", "cap_hw", "cap_int", "cap_life2", "cap_macro"),
  "hotel-tee": g("hotel-tee_front", "hotel-tee_life", "hotel-tee_back"),
  "sunday-short": g("sunday-short_pack", "sunday-short_life"),
  "linen-shirt": g("linen-shirt_front", "linen-shirt_back", "linen-shirt_det"),
  "rugby-tee": g("rugby-tee_front", "rugby-tee_back"),
  "tennis-polo": g("tennis-polo_front", "tennis-polo_back"),
  "linen-trouser": g("linen-trouser_pack", "linen-trouser_life"),
  "graphic-tee": g("graphic-tee_front", "graphic-tee_back", "graphic-tee_det"),
  "stripe-shirt": g("stripe-shirt_pack", "stripe-shirt_det"),
  "bowling-shirt": g("bowling-shirt_front", "bowling-shirt_back"),
  "beach-tote": g("beach-tote_pack", "beach-tote_det"),
  "crew-sweat": g("crew-sweat_front", "crew-sweat_back"),
};

/** Colour-specific galleries where the boards show that colourway. */
export const colourGalleries: Record<string, Record<string, string[]>> = {
  "match-cap": {
    Cream: g("cap_life2", "cap_r2", "cap_macro", "cap_r4", "match-cap_pack"),
    Navy: g("cap_r1", "cap_r4", "match-cap_pack", "cap_life2"),
  },
};

/** The lookbook rail: real people, relaxed poses, clubs, coast, café. */
export const lookbook: { src: string; caption: string; slug?: string }[] = [
  { src: "/p/cap_life.webp", caption: "Match Cap, Forest", slug: "match-cap" },
  { src: "/p/tee_life2.webp", caption: "Club Tee, Off White", slug: "club-tee" },
  { src: "/p/cap_r2.webp", caption: "Match Cap, Cream", slug: "match-cap" },
  { src: "/p/linen-trouser_life.webp", caption: "Linen Trouser, Stone", slug: "linen-trouser" },
  { src: "/p/cap_life2.webp", caption: "Same cap, different days", slug: "match-cap" },
  { src: "/p/hotel-tee_life.webp", caption: "Hotel Tee, Cream", slug: "hotel-tee" },
  { src: "/p/cap_r3.webp", caption: "Match Cap, Forest", slug: "match-cap" },
  { src: "/p/sunday-short_life.webp", caption: "Sunday Short, Olive", slug: "sunday-short" },
  { src: "/p/cap_r4.webp", caption: "Match Cap, Navy & Cream", slug: "match-cap" },
  { src: "/p/tee_life.webp", caption: "Club Tee, Off White", slug: "club-tee" },
  { src: "/p/cap_r1.webp", caption: "Match Cap, Navy", slug: "match-cap" },
];
