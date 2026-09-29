/**
 * Scene data for the scroll-scrub journey (single-shot).
 *
 * The film is not rendered yet: it waits on generation credits. Until the
 * encoded clip and its exact-frame posters exist in public/assets/world/,
 * FILM_READY stays false and the home page renders its static editorial hero
 * instead of <ScrollScrub />. Flip it to true in the same change that adds the
 * clip, mobile clip and both posters.
 *
 * Keep this array a module constant. Changing its identity on every render
 * intentionally rebuilds the media controller.
 */
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";

export const FILM_READY = false;

/** Brand tokens for the journey layer (PICKLE palette). */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#E8B863",
  background: "#143323",
  ink: "#FAF8F5",
  muted: "#C9C2B4",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Raking late-afternoon light crosses a bolt of undyed Belgian flax on an old teak table. Every slub reads as a shadow.",
    clip: "/assets/world/scene-01.mp4",
    id: "scene-01",
    kicker: "Series 01 // Summer 2026",
    label: "The cloth",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    poster: "/assets/world/scene-01-poster.png",
    tags: ["170 GSM flax", "Enzyme washed"],
    title: "Familiar object. Unexpected treatment.",
  },
];
