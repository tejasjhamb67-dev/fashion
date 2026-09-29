/**
 * PICKLE catalogue: the content schema the whole storefront renders from.
 * Presentation components never hard-code product facts; they read them here.
 * Prices are INR, whole rupees. Photography is not shot yet, so every product
 * carries a `shots` list that the gallery renders as labelled plates.
 */

export type CategoryId = "tees" | "caps" | "shorts" | "linen";

export type Colourway = {
  name: string;
  code: string;
  hex: string;
};

export type SizeOption = {
  label: string;
  available: boolean;
};

export type SpecRow = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  ref: string;
  price: number;
  series: string;
  tagline: string;
  description: string[];
  colours: Colourway[];
  sizes: SizeOption[];
  material: SpecRow[];
  silhouette: SpecRow[];
  finishing: SpecRow[];
  care: string[];
  fitNote: string;
  measurements?: { headers: string[]; rows: string[][] };
  shots: string[];
  macro: string;
  lowStock?: boolean;
  featured?: boolean;
};

export type Category = {
  id: CategoryId;
  index: string;
  label: string;
  panel: string;
  note: string;
};

export const categories: Category[] = [
  { id: "tees", index: "01", label: "T-Shirts", panel: "The Tee", note: "Heavyweight combed cotton" },
  { id: "caps", index: "02", label: "Caps", panel: "The Cap", note: "Test-match linen construction" },
  { id: "shorts", index: "03", label: "Shorts", panel: "The Short", note: "Tailored leisure" },
  { id: "linen", index: "04", label: "Linen", panel: "The Linen", note: "Belgian flax urban shirts" },
];

const c = {
  chalk: { name: "Chalk", code: "CHK", hex: "#F4F0E8" },
  navy: { name: "Washed Navy", code: "NVY", hex: "#1F2A44" },
  cricket: { name: "Cricket Green", code: "GRN", hex: "#1D4832" },
  bisque: { name: "Bisque", code: "BSQ", hex: "#EDE4CF" },
  bottle: { name: "Bottle Green", code: "BTL", hex: "#24382C" },
  grey: { name: "Washed Grey", code: "GRY", hex: "#8E9092" },
  black: { name: "Faded Black", code: "BLK", hex: "#2A2A2B" },
  sage: { name: "Sage", code: "SGE", hex: "#A5AE92" },
  cream: { name: "Cream", code: "CRM", hex: "#EFE6D2" },
  tomato: { name: "Tomato", code: "TOM", hex: "#D14B3C" },
  olive: { name: "Olive", code: "OLV", hex: "#6B6B3D" },
  sea: { name: "Sea Blue", code: "SEA", hex: "#5C7F95" },
  terracotta: { name: "Terracotta", code: "TRC", hex: "#B5654A" },
  natural: { name: "Natural Flax", code: "FLX", hex: "#D8CBB3" },
  stone: { name: "Stone", code: "STN", hex: "#C9BFAE" },
} satisfies Record<string, Colourway>;

const apparel = (soldOut: string[] = []): SizeOption[] =>
  ["XS", "S", "M", "L", "XL", "XXL"].map((label) => ({ label, available: !soldOut.includes(label) }));

const waist = (soldOut: string[] = []): SizeOption[] =>
  ["28", "30", "32", "34", "36", "38"].map((label) => ({ label, available: !soldOut.includes(label) }));

const oneSize: SizeOption[] = [{ label: "O/S", available: true }];

const teeCare = [
  "Cold wash inside out, 30°C maximum.",
  "Dry flat in shade. The carbon wash fades gently; direct sun speeds it up.",
  "Warm iron on the reverse. Never on the embroidery.",
];

const teeMeasure = {
  headers: ["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"],
  rows: [
    ["XS", "108", "68", "52"],
    ["S", "114", "70", "54"],
    ["M", "120", "72", "56"],
    ["L", "126", "74", "58"],
    ["XL", "132", "76", "60"],
    ["XXL", "138", "78", "62"],
  ],
};

const shortMeasure = {
  headers: ["Size", "Waist relaxed (cm)", "Inseam (in)", "Leg opening (cm)"],
  rows: [
    ["28", "72", "6.5", "30"],
    ["30", "77", "6.5", "31"],
    ["32", "82", "6.5", "32"],
    ["34", "87", "6.5", "33"],
    ["36", "92", "6.5", "34"],
    ["38", "97", "6.5", "35"],
  ],
};

const shirtMeasure = {
  headers: ["Size", "Chest (cm)", "Length (cm)", "Sleeve (cm)"],
  rows: [
    ["S", "116", "72", "24"],
    ["M", "122", "74", "25"],
    ["L", "128", "76", "26"],
    ["XL", "134", "78", "27"],
    ["XXL", "140", "80", "28"],
  ],
};

const capMeasure = {
  headers: ["Crown depth", "Peak length", "Circumference"],
  rows: [["10.5 cm", "6.5 cm", "54 to 61 cm, adjustable"]],
};

export const products: Product[] = [
  // ─── Caps ───────────────────────────────────────────────────────────────
  {
    slug: "the-match-cap",
    name: "The Match Cap",
    category: "caps",
    ref: "02-CAP",
    price: 3400,
    series: "Series 01 // Summer 2026",
    tagline: "A Test-match baggy, taken off the field and softened for the street.",
    description: [
      "Modelled on the old Australian and Indian Test-match caps, then cut down into a low six-panel profile. The crown is unstructured washed Irish linen, so it collapses in a bag and recovers on the head. It wrinkles. That is the point.",
      "A shallow 6.5 cm peak with six rows of archival stitching, a cast brass buckle that will dull honestly, and an 18 mm club emblem embroidered at centre front. Nothing else to read.",
    ],
    colours: [c.cricket, c.navy, c.chalk],
    sizes: oneSize,
    material: [
      { label: "Fabric", value: "100% washed heavy Irish linen, 320 GSM" },
      { label: "Hand-feel", value: "Dry, slubbed, softens with wear" },
      { label: "Sweatband", value: "Natural cream cotton twill" },
      { label: "Origin", value: "Kerala tailored" },
    ],
    silhouette: [
      { label: "Crown", value: "Unstructured six-panel, no buckram" },
      { label: "Peak", value: "6.5 cm, gentle natural curve" },
      { label: "Profile", value: "Low, sits close to the head" },
    ],
    finishing: [
      { label: "Peak stitching", value: "6 rows, 8 stitches per cm" },
      { label: "Hardware", value: "Cast raw brass buckle, unpolished" },
      { label: "Branding", value: "18 mm embroidered club emblem" },
      { label: "Wash", value: "Enzyme washed, pre-shrunk" },
    ],
    care: ["Hand wash cold. Reshape while damp.", "Dry on a bowl or a fist, never in a dryer.", "Brass will darken. Leave it."],
    fitNote: "One size, adjustable brass strap from 54 to 61 cm. If you are between hats, it will find you.",
    measurements: capMeasure,
    shots: ["Full front on chalk", "Macro: linen slub and peak stitching", "Profile: bill curve", "Rear: brass hardware", "Candid: on a teak table"],
    macro: "Macro: 6-row peak stitch",
    featured: true,
  },
  {
    slug: "the-member-cap",
    name: "The Member Cap",
    category: "caps",
    ref: "PKL-01-CAP-MBR",
    price: 1600,
    series: "Vol. 01 // The Off-Season",
    tagline: "Structured six-panel. Says OFF DUTY at the front, in brass thread.",
    description: [
      "The entry ticket to the club. A structured six-panel crown with brass-coloured OFF DUTY embroidery at the front and a small PKL hit on the side, raised to 4 mm so it catches low light.",
      "No fit risk, giftable, and it puts the brand where people can see it without the brand shouting.",
    ],
    colours: [c.bottle, c.navy, c.bisque, c.tomato, c.grey],
    sizes: oneSize,
    material: [
      { label: "Fabric", value: "Brushed cotton twill, 280 GSM" },
      { label: "Crown lining", value: "Light buckram, holds its shape" },
      { label: "Sweatband", value: "Cotton twill" },
    ],
    silhouette: [
      { label: "Crown", value: "Structured six-panel, mid profile" },
      { label: "Peak", value: "7 cm, pre-curved" },
    ],
    finishing: [
      { label: "Front", value: "OFF DUTY embroidery, 4 mm raised" },
      { label: "Side", value: "PKL embroidered hit" },
      { label: "Closure", value: "Self-fabric strap, antique brass clasp" },
    ],
    care: ["Spot clean where possible.", "Hand wash cold if you must. Air dry on a form."],
    fitNote: "One size, adjustable from 55 to 60 cm.",
    measurements: capMeasure,
    shots: ["Full front on chalk", "Macro: raised embroidery", "Profile", "Rear: brass clasp"],
    macro: "Macro: 4 mm raised thread",
  },
  {
    slug: "the-leisure-cap",
    name: "The Leisure Cap",
    category: "caps",
    ref: "PKL-01-CAP-LSR",
    price: 1500,
    series: "Vol. 01 // The Off-Season",
    tagline: "Unstructured and worn-in from the first day.",
    description: [
      "An unstructured six-panel in garment-dyed cotton, washed until it forgot it was new. A small MEMBER line and the club emblem are the only marks.",
      "For people who already own a cap they love and want a second one that behaves the same way.",
    ],
    colours: [c.cream, c.olive, c.black, c.sea],
    sizes: oneSize,
    material: [
      { label: "Fabric", value: "Garment-dyed cotton canvas, 260 GSM" },
      { label: "Sweatband", value: "Cotton twill" },
    ],
    silhouette: [
      { label: "Crown", value: "Unstructured, low profile" },
      { label: "Peak", value: "6.8 cm, soft curve" },
    ],
    finishing: [
      { label: "Front", value: "MEMBER embroidery with club emblem" },
      { label: "Wash", value: "Garment dyed, stone washed" },
      { label: "Closure", value: "Brass slide buckle" },
    ],
    care: ["Hand wash cold.", "Air dry. Colour will soften over time."],
    fitNote: "One size, adjustable from 54 to 60 cm.",
    measurements: capMeasure,
    shots: ["Full front on chalk", "Macro: garment-dye texture", "Profile", "Candid: in a back pocket"],
    macro: "Macro: garment-dye canvas",
  },

  // ─── T-Shirts ───────────────────────────────────────────────────────────
  {
    slug: "the-club-tee",
    name: "The Club Tee",
    category: "tees",
    ref: "01-TEE-CLB",
    price: 2200,
    series: "Series 01 // Summer 2026",
    tagline: "Boxy, dry-handed cotton with a collar that refuses to sag.",
    description: [
      "A relaxed boxy cut with a dropped shoulder and a clean vertical drape through the arm. The 1.25 inch 1x1 rib collar sits high against the neck and is engineered to stay there after a hundred washes.",
      "260 GSM combed organic cotton with a light carbon wash for a dry, textured hand. The only branding is a 12 mm blind tonal embroidery on the rear right shoulder blade.",
    ],
    colours: [c.chalk, c.navy, c.cricket],
    sizes: apparel(["XXL"]),
    material: [
      { label: "Fabric", value: "100% combed organic cotton, 260 GSM" },
      { label: "Hand-feel", value: "Dry, matte, lightly textured" },
      { label: "Origin", value: "Knitted and cut in Tiruppur" },
    ],
    silhouette: [
      { label: "Cut", value: "Relaxed boxy, dropped shoulder" },
      { label: "Collar", value: "1.25 in 1x1 rib, high neck" },
      { label: "Length", value: "Sits at the hip, straight hem" },
    ],
    finishing: [
      { label: "Seams", value: "Twin-needle hems, taped shoulders" },
      { label: "Wash", value: "Carbon wash, pre-shrunk" },
      { label: "Branding", value: "12 mm blind embroidery, rear right shoulder" },
    ],
    care: teeCare,
    fitNote: "Cut boxy on purpose. Take your usual size for the intended drape; size down for a closer body.",
    measurements: teeMeasure,
    shots: ["Full body front", "Macro: 1x1 rib collar", "Back: blind embroidery", "Profile: shoulder drop", "Candid: stand seats"],
    macro: "Macro: 260 GSM jersey",
    featured: true,
  },
  {
    slug: "the-heavyweight-tee",
    name: "The Heavyweight Tee",
    category: "tees",
    ref: "01-TEE-HVY",
    price: 2600,
    series: "Series 01 // Summer 2026",
    tagline: "280 GSM. Holds its shape the way a good jacket does.",
    description: [
      "The same boxy block as the Club Tee in a denser 280 GSM jersey, so it stands a little away from the body and falls in straight lines.",
      "An unvarnished woven tab is sewn flush into the side hem. No front logo, no back print, just weight.",
    ],
    colours: [c.bisque, c.black, c.sage],
    sizes: apparel(["XS"]),
    material: [
      { label: "Fabric", value: "100% combed organic cotton, 280 GSM" },
      { label: "Hand-feel", value: "Dense, dry, structured" },
      { label: "Origin", value: "Knitted and cut in Tiruppur" },
    ],
    silhouette: [
      { label: "Cut", value: "Boxy, dropped shoulder" },
      { label: "Collar", value: "1.25 in 1x1 rib" },
    ],
    finishing: [
      { label: "Wash", value: "Carbon wash, pre-shrunk" },
      { label: "Branding", value: "Woven tab flush in the side hem" },
    ],
    care: teeCare,
    fitNote: "True to size for a boxy fit. The weight means it will not cling at any size.",
    measurements: teeMeasure,
    shots: ["Full body front", "Macro: dense jersey", "Side: woven hem tab", "Candid"],
    macro: "Macro: 280 GSM density",
  },
  {
    slug: "the-issue-tee",
    name: "The Issue Tee",
    category: "tees",
    ref: "PKL-01-TEE-ISS",
    price: 1900,
    series: "Vol. 01 // The Off-Season",
    tagline: "The everyday one. The one you buy three of.",
    description: [
      "A near-plain heavyweight tee with a tiny PKL emblem at the left chest and an Issue No. marked at the hem, like kit handed out at the start of a season.",
      "It is the backbone of the range and designed to be worn into the ground.",
    ],
    colours: [c.bisque, c.navy, c.bottle, c.grey],
    sizes: apparel(),
    material: [
      { label: "Fabric", value: "100% combed cotton, 240 GSM" },
      { label: "Hand-feel", value: "Soft, substantial" },
    ],
    silhouette: [
      { label: "Cut", value: "Relaxed, slightly dropped shoulder" },
      { label: "Collar", value: "1 in rib" },
    ],
    finishing: [
      { label: "Chest", value: "Small PKL emblem, embroidered" },
      { label: "Hem", value: "Printed Issue No." },
    ],
    care: teeCare,
    fitNote: "Relaxed but not boxy. Take your usual size.",
    measurements: teeMeasure,
    shots: ["Full body front", "Macro: chest emblem", "Hem: Issue No.", "Candid"],
    macro: "Macro: chest emblem",
  },
  {
    slug: "the-department-tee",
    name: "The Department Tee",
    category: "tees",
    ref: "PKL-01-TEE-DEPT",
    price: 2400,
    series: "Vol. 01 // The Off-Season",
    tagline: "Issued by the Private Leisure Department. For recreational use only.",
    description: [
      "A small Private Leisure Dept. line at the chest, and on the back the one loud graphic of the drop: the department seal, printed in a single flat ink.",
      "It is the identity worn, and the piece that explains the brand without anyone having to.",
    ],
    colours: [c.bisque, c.bottle, c.navy, c.chalk],
    sizes: apparel(["XS", "XXL"]),
    material: [
      { label: "Fabric", value: "100% combed cotton, 260 GSM" },
      { label: "Print", value: "Water-based, single colour" },
    ],
    silhouette: [
      { label: "Cut", value: "Boxy, dropped shoulder" },
      { label: "Collar", value: "1.25 in 1x1 rib" },
    ],
    finishing: [
      { label: "Front", value: "Chest line, small" },
      { label: "Back", value: "Department seal print" },
    ],
    care: teeCare,
    fitNote: "Boxy. Take your usual size.",
    measurements: teeMeasure,
    shots: ["Full body back: seal print", "Front: chest line", "Macro: print texture", "Candid"],
    macro: "Macro: water-based seal",
  },
  {
    slug: "non-competitive-div-tee",
    name: "Non-Competitive Div. Tee",
    category: "tees",
    ref: "PKL-01-TEE-ATH",
    price: 2500,
    series: "Vol. 01 // The Off-Season",
    tagline: "Collegiate athletics for people with no intention of competing.",
    description: [
      "PKL ATHLETIC spelled out across the front in a collegiate face, and NON-COMPETITIVE / SPORTS DIVISION on the back.",
      "The statement piece of the drop, made in a small run. The Tomato colourway is the only loud colour in the season.",
    ],
    colours: [c.tomato, c.cream, c.navy, c.olive],
    sizes: apparel(["XS", "S"]),
    material: [
      { label: "Fabric", value: "100% combed cotton, 260 GSM" },
      { label: "Print", value: "Flock front, water-based back" },
    ],
    silhouette: [
      { label: "Cut", value: "Boxy, dropped shoulder" },
      { label: "Collar", value: "1.25 in 1x1 rib" },
    ],
    finishing: [
      { label: "Front", value: "PKL ATHLETIC flock spellout" },
      { label: "Back", value: "Division print" },
    ],
    care: teeCare,
    fitNote: "Boxy. Take your usual size.",
    measurements: teeMeasure,
    shots: ["Full body front", "Back: division print", "Macro: flock", "Candid: nets"],
    macro: "Macro: flock lettering",
    lowStock: true,
  },
  {
    slug: "the-off-season-tee",
    name: "The Off-Season Tee",
    category: "tees",
    ref: "PKL-01-TEE-OFF",
    price: 2300,
    series: "Vol. 01 // The Off-Season",
    tagline: "Gone swimming. Back never.",
    description: [
      "The Off-Season set in an italic serif at the chest, VOL. 01 beneath it, and a dry line at the hem for anyone close enough to read it.",
      "The quiet, collectible one. Soft enough to sleep in, sharp enough not to.",
    ],
    colours: [c.chalk, c.sea, c.terracotta, c.black],
    sizes: apparel(),
    material: [
      { label: "Fabric", value: "100% combed cotton, 240 GSM" },
      { label: "Print", value: "Water-based, tonal" },
    ],
    silhouette: [
      { label: "Cut", value: "Relaxed" },
      { label: "Collar", value: "1 in rib" },
    ],
    finishing: [
      { label: "Chest", value: "Italic serif print" },
      { label: "Hem", value: "Printed line" },
    ],
    care: teeCare,
    fitNote: "Relaxed. Take your usual size.",
    measurements: teeMeasure,
    shots: ["Full body front", "Macro: italic print", "Hem detail", "Candid: promenade"],
    macro: "Macro: tonal print",
  },

  // ─── Shorts ─────────────────────────────────────────────────────────────
  {
    slug: "the-leisure-short",
    name: "The Leisure Short",
    category: "shorts",
    ref: "03-SHT-LSR",
    price: 3200,
    series: "Series 01 // Summer 2026",
    tagline: "A 6.5 inch inseam, a straight wide leg, and a horn button at the back.",
    description: [
      "Sits comfortably above the knee with a wide, straight leg. The waistband is a hybrid: a clean flat front with an internal herringbone drawcord, and an elasticated back for the long lunch.",
      "Deep slash front pockets reinforced with bar-tacks, and a single rear welt pocket closed with a genuine horn button.",
    ],
    colours: [c.stone, c.navy, c.cricket],
    sizes: waist(["38"]),
    material: [
      { label: "Fabric", value: "55/45 linen-cotton blend, 210 GSM" },
      { label: "Drawcord", value: "Herringbone cotton tape" },
      { label: "Origin", value: "Cut and sewn in Bengaluru" },
    ],
    silhouette: [
      { label: "Inseam", value: "6.5 in" },
      { label: "Leg", value: "Wide, straight" },
      { label: "Rise", value: "Mid" },
    ],
    finishing: [
      { label: "Pockets", value: "Slash front with bar-tacks, rear welt" },
      { label: "Button", value: "Genuine horn" },
      { label: "Waist", value: "Flat front, elastic back" },
    ],
    care: ["Cold wash, gentle cycle.", "Line dry. Linen blends crease; let them."],
    fitNote: "True to waist size. The elastic back gives about 4 cm of ease.",
    measurements: shortMeasure,
    shots: ["Full front", "Macro: linen-cotton weave", "Rear: horn button welt", "Candid: sea wall"],
    macro: "Macro: 55/45 weave",
    featured: true,
  },
  {
    slug: "the-off-duty-short",
    name: "The Off-Duty Short",
    category: "shorts",
    ref: "PKL-01-SHT-ODT",
    price: 2600,
    series: "Vol. 01 // The Off-Season",
    tagline: "Turns a pile of separates into an outfit.",
    description: [
      "A relaxed 7 inch drawcord short in heavy cotton twill. A tiny PKL hit on the left leg; everything else is plain on purpose.",
      "The wardrobe completer. Wears with every tee in the range.",
    ],
    colours: [c.bisque, c.navy, c.olive, c.black],
    sizes: waist(),
    material: [
      { label: "Fabric", value: "Heavy cotton twill, 210 GSM" },
      { label: "Drawcord", value: "Flat cotton" },
    ],
    silhouette: [
      { label: "Inseam", value: "7 in" },
      { label: "Leg", value: "Relaxed" },
    ],
    finishing: [
      { label: "Leg", value: "Small PKL embroidered hit" },
      { label: "Waist", value: "Full elastic with drawcord" },
    ],
    care: ["Cold wash.", "Line dry."],
    fitNote: "Relaxed. Take your usual waist size.",
    measurements: shortMeasure,
    shots: ["Full front", "Macro: twill", "Leg: PKL hit", "Candid"],
    macro: "Macro: 210 GSM twill",
  },

  // ─── Linen ──────────────────────────────────────────────────────────────
  {
    slug: "the-sunday-overshirt",
    name: "The Sunday Overshirt",
    category: "linen",
    ref: "04-LIN-SUN",
    price: 5800,
    series: "Series 01 // Summer 2026",
    tagline: "A generous camp collar in Belgian flax, worn open over everything.",
    description: [
      "A short-sleeve camp-collar shirt cut generous through the body, so it works as a shirt on its own or as a light layer over a tee.",
      "Natural Belgian flax at 170 GSM with visible slub, enzyme washed to take away any synthetic sheen. Genuine mother-of-pearl buttons are cross-stitched in tonal thread, and every seam is French.",
    ],
    colours: [c.natural, c.navy, c.cricket],
    sizes: shirtMeasure.rows.map(([label]) => ({ label, available: label !== "S" })),
    material: [
      { label: "Fabric", value: "100% Belgian flax linen, 170 GSM" },
      { label: "Hand-feel", value: "Crisp at first, soft by the third wash" },
      { label: "Origin", value: "Woven in Belgium, sewn in Mumbai" },
    ],
    silhouette: [
      { label: "Collar", value: "Camp collar" },
      { label: "Sleeve", value: "Short, elbow-grazing" },
      { label: "Body", value: "Generous, straight hem" },
    ],
    finishing: [
      { label: "Buttons", value: "Mother-of-pearl, cross-stitched" },
      { label: "Seams", value: "French seams throughout" },
      { label: "Wash", value: "Enzyme washed" },
    ],
    care: ["Cold wash, gentle.", "Hang to dry. Iron damp if you like, or never."],
    fitNote: "Cut generous. Size down once if you want it as a shirt rather than an overshirt.",
    measurements: shirtMeasure,
    shots: ["Full body front", "Macro: flax slub", "Collar and mother-of-pearl", "Back drape", "Candid: café chair"],
    macro: "Macro: Belgian slub",
    featured: true,
  },
  {
    slug: "the-utility-shirt",
    name: "The Utility Shirt",
    category: "linen",
    ref: "04-LIN-UTL",
    price: 6200,
    series: "Series 01 // Summer 2026",
    tagline: "Long sleeves, relaxed spread collar, two pockets that earn their place.",
    description: [
      "A relaxed long-sleeve shirt with a spread collar and two flap chest pockets. Roll the sleeves twice and it becomes a summer jacket.",
      "French flax at 180 GSM, enzyme washed, with mother-of-pearl buttons and French seams.",
    ],
    colours: [c.natural, c.stone, c.navy],
    sizes: shirtMeasure.rows.map(([label]) => ({ label, available: true })),
    material: [
      { label: "Fabric", value: "100% French flax linen, 180 GSM" },
      { label: "Origin", value: "Woven in France, sewn in Mumbai" },
    ],
    silhouette: [
      { label: "Collar", value: "Relaxed spread" },
      { label: "Sleeve", value: "Long, single-button cuff" },
      { label: "Body", value: "Relaxed, curved hem" },
    ],
    finishing: [
      { label: "Pockets", value: "Two flap chest pockets" },
      { label: "Buttons", value: "Mother-of-pearl" },
      { label: "Seams", value: "French seams" },
    ],
    care: ["Cold wash, gentle.", "Hang to dry."],
    fitNote: "Relaxed. Take your usual shirt size.",
    measurements: shirtMeasure,
    shots: ["Full body front", "Macro: flax weave", "Pocket flap", "Sleeves rolled", "Candid"],
    macro: "Macro: French flax",
  },
];

export type Collection = {
  slug: string;
  index: string;
  title: string;
  season: string;
  intro: string;
  body: string;
  products: string[];
};

export const collections: Collection[] = [
  {
    slug: "series-01-match-day",
    index: "01",
    title: "Series 01: Match Day",
    season: "Summer 2026",
    intro: "Familiar garments, reconstructed without the hype.",
    body: "The launch capsule. Six pieces built around the Match Cap: things you would wear to watch a five-day game from the cheap seats, then to dinner without going home first.",
    products: ["the-match-cap", "the-club-tee", "the-heavyweight-tee", "the-leisure-short", "the-sunday-overshirt", "the-utility-shirt"],
  },
  {
    slug: "vol-01-the-off-season",
    index: "02",
    title: "Vol. 01: The Off-Season",
    season: "Private Leisure Dept.",
    intro: "Kit for people who are professionally off-duty.",
    body: "Seven pieces issued by the Private Leisure Department. Quiet and well made, dryly funny in the labelling rather than the graphics. One small wardrobe you could pack for a slow week.",
    products: ["the-member-cap", "the-leisure-cap", "the-issue-tee", "the-department-tee", "non-competitive-div-tee", "the-off-season-tee", "the-off-duty-short"],
  },
  {
    slug: "linen-hours",
    index: "03",
    title: "Linen Hours",
    season: "After 4 pm",
    intro: "For the part of the day when the heat breaks.",
    body: "Flax shirts and linen-blend shorts, made for coastal humidity and slow evenings. Everything creases. Nothing minds.",
    products: ["the-sunday-overshirt", "the-utility-shirt", "the-leisure-short", "the-leisure-cap"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId): Category {
  return categories.find((cat) => cat.id === id) ?? categories[0];
}

export function productsIn(category: CategoryId): Product[] {
  return products.filter((p) => p.category === category);
}

/** Categories that actually have stock to show; empty ones stay hidden. */
export function liveCategories(): Category[] {
  return categories.filter((cat) => productsIn(cat.id).length > 0);
}

export function itemRef(product: Product, colour: Colourway): string {
  return `${product.ref}-${colour.code}`;
}

export function related(product: Product, count = 3): Product[] {
  const same = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const other = products.filter((p) => p.category !== product.category && p.featured);
  return [...same, ...other].slice(0, count);
}

export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 150;
export const EXPRESS_FEE = 250;

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
