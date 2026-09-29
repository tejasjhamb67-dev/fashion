/**
 * Scene data for the scroll-scrub journey.
 *
 * The film is one continuous procedural render (a macro pass across woven
 * Belgian linen, made with NumPy + FFmpeg) cut into three chapters. Each
 * chapter's first frame is the previous chapter's exact last frame, so the
 * joins are seamless. Every poster is the first frame of its encoded clip.
 *
 * Keep this array a module constant. Changing its identity on every render
 * intentionally rebuilds the media controller.
 */
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";

export const FILM_READY = true;

/** Brand tokens for the journey layer (PICKLE palette). */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#E8B863",
  background: "#143323",
  ink: "#FAF8F5",
  muted: "#D9D2C4",
};

const world = "/assets/world";

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "the-cloth",
    label: "The cloth",
    kicker: "01 // The cloth",
    title: "Familiar object. Unexpected treatment.",
    body: "Undyed Belgian flax at 170 GSM, woven loose enough to breathe and slubbed enough to catch the last of the light.",
    tags: ["170 GSM flax", "Enzyme washed"],
    clip: `${world}/scene-01.mp4`,
    poster: `${world}/scene-01-poster.jpg`,
    mobileClip: `${world}/scene-01-mobile.mp4`,
    mobilePoster: `${world}/scene-01-mobile-poster.jpg`,
    align: "left",
  },
  {
    id: "the-light",
    label: "The light",
    kicker: "02 // The light",
    title: "Made to crease.",
    body: "Linen reads best at an angle. Low sun finds every slub and every uneven thread, which is why it looks better on day three than day one.",
    tags: ["Belgian slub", "French seams"],
    clip: `${world}/scene-02.mp4`,
    poster: `${world}/scene-02-poster.jpg`,
    mobileClip: `${world}/scene-02-mobile.mp4`,
    mobilePoster: `${world}/scene-02-mobile-poster.jpg`,
    align: "right",
  },
  {
    id: "the-stitch",
    label: "The stitch",
    kicker: "03 // The stitch",
    title: "Six rows. Eight stitches a centimetre.",
    body: "The peak of the Match Cap carries six rows of archival stitching. It takes longer to sew. It is what makes the cap look finished from across a room.",
    tags: ["The Match Cap", "Cricket green thread"],
    clip: `${world}/scene-03.mp4`,
    poster: `${world}/scene-03-poster.jpg`,
    mobileClip: `${world}/scene-03-mobile.mp4`,
    mobilePoster: `${world}/scene-03-mobile-poster.jpg`,
    align: "left",
  },
];
