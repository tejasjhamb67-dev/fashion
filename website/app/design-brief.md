# PICKLE design brief

**Design read.** A storefront for people who buy a garment because the fabric weight, neck drop and shoulder are right; the register is dry, tactile and quietly funny, a fashion broadsheet with commerce embedded.

**Concept spine.** An archival match-day record: every page reads like a scorecard, club membership slip or hotel laundry roster, with hairline frames, leading-zero indices and stamped metadata beside every serif headline.

**Delivery tier.** `editorial` for now (typography, labelled photo plates, bespoke chrome, micro-motion only), upgrading to the animated film hero once generation credits exist.

**Locked palette** (user's own brand colours, from the PICKLE creative direction spec; overrides the beige/cream ban):
chalk `#FAF8F5`, cream `#F2EDE2`, stone `#E3DCCE`, washed navy `#131922`, slate ink `#586270`, cricket green `#1D4832` (dark `#143323`), stamp red `#B53826`, faded amber `#E8B863`, white `#FFFFFF`. Defense: sun-bleached natural substrates interrupted by sporting dyes, exactly as the brand spec states.

**Locked type.** Inter (stand-in for PP Neue Montreal) for all UI, prices, specs and micro labels; Baskervville (stand-in for Ogg / Baskerville Display) for display, headlines and manifesto lines. Serif justified by the brand spec's literary editorial lineage.

Animation mode: animated-website — user picked Animated at intake, then chose "Build now, add film later" because the account had 0 generation credits. The scroll-scrub engine ships in the repo and `src/scroll-scrub-scenes.ts` is filled; `FILM_READY` stays false (static editorial hero renders) until the film is generated and encoded.

**Journey shape:** `single-shot`.
**Journey:**
1. The cloth: raking late-afternoon light across a bolt of undyed Belgian flax on a teak table. "Familiar object. Unexpected treatment."
2. The stitch: the camera slides to a cap peak, six rows of stitching reading as shadow lines.
3. The brass: a cast brass buckle catches the last sun.
4. The table: pull back to reveal a folded linen shirt, a worn red ball, a paper scorecard; the closing beauty state.
**World grammar:** one continuous slow push and rise, 35mm natural perspective, low warm directional light softened by haze, deep forest shadow falling off to near black, locked exposure, no text, no people, no cuts.
**Mobile framing:** subject held centre-safe; lighter 720p encode.
**How the journey enacts the spine:** it is a single slow look at the materials the scorecard lists.

**Section plan (home).**
1. Split hero 50/50: display serif statement + stamps / 4:5 editorial plate (split-hero family).
2. Lateral category navigator: four department panels on a horizontal rail (rail family).
3. Signature showcase 60/40: macro plate + pinned spec sheet with swatches and inline Add to bag (asymmetric split family).
4. Product rail with custom hairline scroll indicator (rail family, staggered crops).
5. World statement on cream: display line + three numbered notes (statement family).
6. Field study: three-column asymmetric photo essay with centre text card (collage family).
7. Journal index: ruled list rows (ledger family).

**Asset plan.** No product photography yet (user request). Every image slot is a labelled plate with the final aspect ratio and a CSS weave texture, so real photos drop in with zero layout shift. Generated later: the scroll film, launch cover and OG image. Shipped now: SVG favicon, PNG app icons, web manifest.

**CTA inventory.**
- Add to bag: full-width navy block, turns cricket green with an inline check.
- Discover the catalogue: text link with a drawn underline and nudging arrow.
- Checkout / Place order: navy block with price set right.
- Write a review: hairline outline that floods navy.
- Filter pills: hairline boxes that invert when active.
- Newsletter "Sign in": register-line input with inline text button.
