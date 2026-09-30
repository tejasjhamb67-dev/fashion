/**
 * PICKLE catalogue, SS25. Mirrors the product board: 13 pieces, four departments.
 * Prices are whole rupees. The same slugs, prices, colours and sizes are seeded
 * into Supabase (`products`), where `place_order` re-prices every bag server-side.
 */

import { colourGalleries, galleries } from "./media";

export type CategoryId = "tops" | "shirts" | "bottoms" | "accessories";

export type Colour = { name: string; hex: string };

export type Product = {
  slug: string;
  no: string;
  name: string;
  category: CategoryId;
  price: number;
  line: string;
  description: string;
  fabric: string;
  fit: string;
  graphic: string;
  construction: string;
  colours: Colour[];
  sizes: string[];
  care: string;
  /** Image paths per colour name, in gallery order: packshot, on-body, detail. */
  images: Record<string, string[]>;
  tag?: "New" | "Bestseller" | "Low stock";
};

export const categories: { id: CategoryId; label: string; video: string; poster: string }[] = [
  { id: "tops", label: "Tees & Polos", video: "/media/tees.mp4", poster: "/media/tees.jpg" },
  { id: "shirts", label: "Shirts", video: "/media/linen.mp4", poster: "/media/linen.jpg" },
  { id: "bottoms", label: "Shorts & Trousers", video: "/media/shorts.mp4", poster: "/media/shorts.jpg" },
  { id: "accessories", label: "Caps & Bags", video: "/media/caps.mp4", poster: "/media/caps.jpg" },
];

const C = {
  offWhite: { name: "Off White", hex: "#EEE8DA" },
  cream: { name: "Cream", hex: "#E6DCC6" },
  white: { name: "White", hex: "#F5F3EE" },
  navy: { name: "Navy", hex: "#1D2638" },
  green: { name: "Green", hex: "#23402E" },
  forest: { name: "Forest", hex: "#23402E" },
  olive: { name: "Olive", hex: "#5F6844" },
  sand: { name: "Sand", hex: "#CBB894" },
  stone: { name: "Stone", hex: "#CFC5B0" },
  tobacco: { name: "Tobacco", hex: "#6E4431" },
  rust: { name: "Rust", hex: "#94452F" },
  charcoal: { name: "Charcoal", hex: "#2F2E2B" },
  grey: { name: "Grey", hex: "#A7A6A1" },
  sage: { name: "Sage", hex: "#9DA88C" },
  blueStripe: { name: "Blue Stripe", hex: "#A8BCD4" },
  greenStripe: { name: "Green Stripe", hex: "#7F9A7F" },
  natural: { name: "Natural", hex: "#E2D6BC" },
} satisfies Record<string, Colour>;

const APPAREL = ["S", "M", "L", "XL", "XXL"];
const WAIST = ["28", "30", "32", "34", "36"];

export const products: Product[] = [
  {
    slug: "club-tee",
    no: "01",
    name: "Club Tee",
    category: "tops",
    price: 2200,
    line: "The house tee. Crest on the back, nothing to prove.",
    description:
      "A boxy 220 GSM cotton tee, garment dyed so it arrives already broken in. Small club mark on the chest, the full Athletic Club crest across the back.",
    fabric: "100% Cotton, 220 GSM",
    fit: "Relaxed / Boxy",
    graphic: "Front chest + back print",
    construction: "Ribbed crew neck, garment dyed",
    colours: [C.offWhite, C.navy, C.green],
    sizes: APPAREL,
    care: "Cold wash inside out. Dry in shade.",
    images: {},
    tag: "Bestseller",
  },
  {
    slug: "match-cap",
    no: "02",
    name: "Match Cap",
    category: "accessories",
    price: 1800,
    line: "Traditional shape. Modern attitude.",
    description:
      "Six panels of washed linen-cotton with a raised 'P' in off-white embroidery. Brass buckle at the back, Match No. 07 printed under the peak.",
    fabric: "Linen / Cotton, 220 GSM",
    fit: "Classic, curved visor",
    graphic: "Embroidered 'P' + side text",
    construction: "6-panel, adjustable brass buckle",
    colours: [C.forest, C.cream, C.navy, C.tobacco],
    sizes: ["One size"],
    care: "Spot clean. Keep the shape, skip the machine.",
    images: {},
    tag: "Bestseller",
  },
  {
    slug: "hotel-tee",
    no: "03",
    name: "Hotel Tee",
    category: "tops",
    price: 2400,
    line: "Checked in. Not checking out.",
    description:
      "Hotel Pickle souvenir graphic on a relaxed 220 GSM tee. Small chest hit, large illustrated back print, faded like it has done a few summers.",
    fabric: "100% Cotton, 220 GSM",
    fit: "Relaxed",
    graphic: "Front chest + back print",
    construction: "Ribbed crew neck, garment dyed",
    colours: [C.cream, C.navy],
    sizes: APPAREL,
    care: "Cold wash inside out. Dry in shade.",
    images: {},
    tag: "New",
  },
  {
    slug: "sunday-short",
    no: "04",
    name: "Sunday Short",
    category: "bottoms",
    price: 3200,
    line: "For the one day nothing is scheduled.",
    description:
      "A linen-cotton short with a button closure, deep side pockets and a small embroidered 'P'. Sits at the waist, ends above the knee.",
    fabric: "Linen / Cotton",
    fit: "Relaxed",
    graphic: "Embroidered 'P'",
    construction: "Button closure, side pockets",
    colours: [C.olive, C.sand, C.navy],
    sizes: WAIST,
    care: "Cold gentle wash. Iron while damp.",
    images: {},
  },
  {
    slug: "linen-shirt",
    no: "05",
    name: "Linen Shirt",
    category: "shirts",
    price: 4800,
    line: "160 GSM of air.",
    description:
      "Lightweight linen with a camp collar, one chest pocket and mother-of-pearl buttons. A small 'P' sits under the collar, where only you will know.",
    fabric: "Linen, 160 GSM",
    fit: "Relaxed",
    graphic: "Under-collar 'P'",
    construction: "Camp collar, chest pocket, mother-of-pearl buttons",
    colours: [C.blueStripe, C.offWhite, C.sage],
    sizes: APPAREL,
    care: "Cold gentle wash. Line dry. Creases are the point.",
    images: {},
    tag: "Bestseller",
  },
  {
    slug: "rugby-tee",
    no: "06",
    name: "Rugby Tee",
    category: "tops",
    price: 3600,
    line: "Rugby Club, contact optional.",
    description:
      "A striped 200 GSM jersey with a contrast collar and ribbed cuffs. Small chest mark, crossed-racquet Rugby Club print on the back.",
    fabric: "Cotton Jersey, 200 GSM",
    fit: "Regular",
    graphic: "Chest + back print",
    construction: "Contrast collar, ribbed cuffs",
    colours: [C.navy, C.green, C.cream],
    sizes: APPAREL,
    care: "Cold wash. Dry flat.",
    images: {},
  },
  {
    slug: "tennis-polo",
    no: "07",
    name: "Tennis Polo",
    category: "tops",
    price: 3400,
    line: "Whites, loosely interpreted.",
    description:
      "Piqué cotton with contrast tipping and a three-button placket. Chest embroidery up front, Tennis Society print across the back.",
    fabric: "Piqué Cotton, 220 GSM",
    fit: "Regular",
    graphic: "Chest embroidery + back print",
    construction: "Contrast tipping, 3-button placket",
    colours: [C.cream, C.green, C.navy],
    sizes: APPAREL,
    care: "Cold wash. Dry flat.",
    images: {},
    tag: "New",
  },
  {
    slug: "linen-trouser",
    no: "08",
    name: "Linen Trouser",
    category: "bottoms",
    price: 4600,
    line: "Relaxed straight. Relaxed everything.",
    description:
      "A linen-cotton trouser cut relaxed and straight, with side pockets and welt pockets at the back. No graphic. It does not need one.",
    fabric: "Linen / Cotton",
    fit: "Relaxed Straight",
    graphic: "None",
    construction: "Side pockets, back welt pockets",
    colours: [C.stone, C.navy, C.olive],
    sizes: WAIST,
    care: "Cold gentle wash. Iron while damp.",
    images: {},
  },
  {
    slug: "graphic-tee",
    no: "09",
    name: "Graphic Tee",
    category: "tops",
    price: 2200,
    line: "Trading Co. Nothing for sale but the tee.",
    description:
      "A 200 GSM tee with a small front mark and a large palm-and-coast Trading Co. print on the back. Garment dyed for a soft, lived-in hand.",
    fabric: "100% Cotton, 200 GSM",
    fit: "Relaxed",
    graphic: "Front small + back large",
    construction: "Ribbed crew neck, garment dyed",
    colours: [C.charcoal, C.white, C.olive],
    sizes: APPAREL,
    care: "Cold wash inside out. Dry in shade.",
    images: {},
  },
  {
    slug: "stripe-shirt",
    no: "10",
    name: "Stripe Shirt",
    category: "shirts",
    price: 4200,
    line: "The stripe does the talking.",
    description:
      "Cotton-linen with a camp collar and one chest pocket. No graphic, just a small 'P' woven label at the hem.",
    fabric: "Cotton Linen, 160 GSM",
    fit: "Relaxed",
    graphic: "None (label detail)",
    construction: "Camp collar, chest pocket",
    colours: [C.greenStripe, C.blueStripe],
    sizes: APPAREL,
    care: "Cold gentle wash. Line dry.",
    images: {},
  },
  {
    slug: "bowling-shirt",
    no: "11",
    name: "Bowling Shirt",
    category: "shirts",
    price: 4400,
    line: "Social Club. Drinks after.",
    description:
      "A linen-viscose camp shirt with contrast piping, a chest embroidery and a Social Club print across the back.",
    fabric: "Linen / Viscose",
    fit: "Relaxed",
    graphic: "Chest embroidery + back print",
    construction: "Camp collar, contrast piping",
    colours: [C.rust, C.navy, C.cream],
    sizes: APPAREL,
    care: "Cold gentle wash. Line dry.",
    images: {},
    tag: "Low stock",
  },
  {
    slug: "beach-tote",
    no: "12",
    name: "Beach Tote",
    category: "accessories",
    price: 1600,
    line: "Holiday Club. Room for a towel and a paperback.",
    description:
      "Heavy canvas with reinforced handles, an internal pocket and a palm-tree Holiday Club print.",
    fabric: "Canvas Cotton",
    fit: "Regular",
    graphic: "Front print",
    construction: "Reinforced handles, internal pocket",
    colours: [C.natural, C.navy, C.green],
    sizes: ["One size"],
    care: "Spot clean.",
    images: {},
  },
  {
    slug: "crew-sweat",
    no: "13",
    name: "Crew Sweat",
    category: "tops",
    price: 3800,
    line: "For the one cold evening a year.",
    description:
      "A 320 GSM French terry crew with ribbed cuffs and hem, and an Athletic Club print on the chest.",
    fabric: "French Terry, 320 GSM",
    fit: "Relaxed",
    graphic: "Front print",
    construction: "Ribbed cuffs & hem",
    colours: [C.grey, C.navy, C.green],
    sizes: APPAREL,
    care: "Cold wash inside out. Dry flat.",
    images: {},
  },
];

for (const p of products) p.images = { [p.colours[0].name]: galleries[p.slug] ?? [], ...colourGalleries[p.slug] };

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const FREE_SHIPPING_FROM = 3000;
export const SHIPPING_FEE = 150;
