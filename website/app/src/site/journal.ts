export type JournalEntry = {
  slug: string;
  no: string;
  title: string;
  dek: string;
  date: string;
  place: string;
  readMinutes: number;
  plates: string[];
  body: string[];
  pull?: string;
  products: string[];
};

export const journal: JournalEntry[] = [
  {
    slug: "field-study-bandra-to-lisbon",
    no: "04",
    title: "Field study: Bandra to Lisbon",
    dek: "Two seafronts, one wardrobe, and a very long lunch.",
    date: "2026-06-14",
    place: "Mumbai / Lisbon",
    readMinutes: 5,
    plates: ["Bandra bandstand, 5:40 pm", "Cais do Sodré, 6:10 pm"],
    body: [
      "Coastal dressing is mostly about humidity management disguised as taste. On the Bandra promenade in May, anything synthetic becomes a regret within ten minutes. In Lisbon in June, the wind off the Tagus makes a short-sleeve linen shirt feel like the correct decision for once in your life.",
      "We packed the same small bag for both: two Club Tees, the Sunday Overshirt, one pair of Leisure Shorts and the Match Cap. Nothing else was needed, and nothing else was missed.",
      "The linen creased on the flight and never uncreased. By the third day it looked better than it had in the shop. That is the argument for flax in one sentence.",
      "The cap did the heavy lifting. Unstructured linen folds flat into a jacket pocket and springs back on the head. In Lisbon a waiter asked if it was a cricket thing. We said it was a lunch thing.",
    ],
    pull: "The linen creased on the flight and never uncreased. By the third day it looked better than it had in the shop.",
    products: ["the-sunday-overshirt", "the-match-cap", "the-leisure-short"],
  },
  {
    slug: "the-test-match-cap",
    no: "03",
    title: "On the Test-match cap",
    dek: "Why the most dignified hat in sport was always the softest one.",
    date: "2026-05-22",
    place: "Kerala",
    readMinutes: 4,
    plates: ["Pattern pieces, workshop bench", "The baggy, archival"],
    body: [
      "The Test cap is a strange object. It is handed over with ceremony, worn for five days in the sun, and kept for decades. It is also, structurally, a soft wool bag with a peak.",
      "We wanted that softness without the wool. The Match Cap uses washed heavy Irish linen, no buckram, and a shallow 6.5 cm peak. It is closer to the old baggies than to the rigid snapbacks most caps descend from.",
      "The peak carries six rows of stitching at eight stitches per centimetre. It takes longer to sew. It is also the detail that makes the cap look finished from across a room.",
    ],
    pull: "It is handed over with ceremony, worn for five days in the sun, and kept for decades.",
    products: ["the-match-cap", "the-member-cap"],
  },
  {
    slug: "why-260-gsm",
    no: "02",
    title: "Why 260 GSM",
    dek: "A short, slightly obsessive note on the weight of a T-shirt.",
    date: "2026-04-30",
    place: "Tiruppur",
    readMinutes: 3,
    plates: ["Knitting floor", "Collar rib under a loupe"],
    body: [
      "GSM is grams per square metre. Most shop-bought tees sit around 160. Ours sit between 240 and 280.",
      "At 260 the fabric starts to hang instead of cling. The shoulder holds a line, the hem falls straight, and the collar has something to anchor to. Much above 300 and the shirt starts to feel like a sweatshirt in a Mumbai summer.",
      "The collar is the other half of it. A 1.25 inch 1x1 rib, cut high, is the reason a tee still looks new after a year. It is also the first thing we check on every sample.",
    ],
    products: ["the-club-tee", "the-heavyweight-tee"],
  },
  {
    slug: "the-private-leisure-department",
    no: "01",
    title: "The Private Leisure Department",
    dek: "An imaginary institution with very real standards.",
    date: "2026-03-18",
    place: "Mumbai",
    readMinutes: 3,
    plates: ["Membership slip, archive", "Laundry roster, hotel"],
    body: [
      "Every brand needs a reason to exist. Ours is a fictional department that issues clothing for recreational use only.",
      "The department has rules. No front logos bigger than a thumbnail. One loud graphic per season. Every garment must survive a long lunch, a short nap and a surprise invitation.",
      "It is a joke, mostly. The standards are not.",
    ],
    products: ["the-department-tee", "the-issue-tee"],
  },
];

export function getEntry(slug: string): JournalEntry | undefined {
  return journal.find((e) => e.slug === slug);
}
