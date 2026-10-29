# Haluna: design direction

> halo + luna. Mineral sun care and soft colour that feel like sun-warmed skin at five in the afternoon.

This document is the source of truth for the redesign. Every value below lives as a
token in `src/styles/tokens.css`. Components never hard-code colours, fonts, radii,
shadows or durations.

---

## 1. Brand concept

The site is designed outward from the hero product: a **matte sand-beige squeeze tube**
with a **white flip-top cap**, and the word **H A L U N A** printed **vertically** in thin,
widely tracked black capitals, with `daily mineral sunscreen` set small and lowercase.

Everything in the interface borrows from that object:

| Packaging detail | Interface translation |
| --- | --- |
| Matte sand tube | `--color-sand` is the primary surface. Product cards are sand, so the product photos (shot on a matching sand sweep) bleed edge to edge with no visible frame. |
| White flip-top cap | Cream/white (`--color-cream`) is reserved for "product" moments: the poured cream, the cream-drop cursor, primary hover states. |
| Vertical thin capitals | A recurring **vertical wordmark rail** (`writing-mode: vertical-rl`) on the hero, the shop, and the footer, plus a vertical marquee. |
| Small lowercase descriptor | Small lowercase labels (`text-label`) next to big display type, e.g. `daily mineral sunscreen · spf 50 · 50 ml`. |
| Late-afternoon light, leaf shadows in the photography | Warm, low-contrast surfaces; no pure white, no pure black. Leaf-shadow crops of the campaign photography sit behind the hero product. |
| Blush and tint shades | **Dusk** sections break the page rhythm. Blush shows up only as colour you could put on skin: clouds, swatches, smears. |

What it deliberately avoids (the "default AI template" look): cream + orange, Fraunces +
Inter, sun/horizon logos, and pages built from rows of three centred icon cards. Layouts
here are asymmetric and editorial: offset grids, one very large element per section,
generous negative space.

---

## 2. Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| `sand` | `#E4D3BC` | Primary surface, product cards, packaging colour |
| `bone` | `#F5EFE6` | Page background |
| `ink` | `#1C1A17` | Text, primary buttons, the lettering on the tube |
| `blush` | `#E59A9B` | Colour-line accent. **Decorative on light backgrounds** (1.95:1 on Bone); allowed as text only on Dusk (5.55:1) |
| `dusk` | `#4A2B3A` | Deep sections (Color line, newsletter, footer) |
| `mineral` | `#C9D6D2` | Cool secondary, used sparingly (after-sun, UV "low", ingredient tags) |
| `cream` | `#FBF8F2` | The cream itself: pour, drop cursor, highlights |
| `ink-soft` | `#5E554C` | Secondary text. 6.38:1 on Bone, 4.98:1 on Sand |
| `rosewood` | `#9A4F55` | Blush-family *text* on light surfaces (5.07:1 on Bone) |
| `dusk-soft` | `#D9B9BE` | Secondary text on Dusk (6.85:1) |

**Never orange.** The UV scale is the only place with traffic-light semantics, and it uses
mineral → sand → blush → rosewood → dusk instead of green-to-red.

## 3. Typography

- **Display: Bricolage Grotesque** (variable `opsz 12–96`, `wdth 75–100`, `wght 200–800`).
  Hero and section headlines run at `wdth 78`, weight 300–400, tracking −0.045em,
  line-height 0.9. That pairing (condensed, light, huge) reads editorial rather than
  "startup".
- **Body/UI: Manrope** 300–700.
- **Packaging capitals:** Manrope 300, uppercase, tracking 0.6em. Used for the vertical
  rails and small labels, so the site's lettering matches the print on the products.

| Step | Size | Leading | Tracking | Use |
| --- | --- | --- | --- | --- |
| `display-xl` | clamp(3.4rem, 8.6vw, 9rem) | 0.88 | −0.05em | Hero headline |
| `display-l` | clamp(2.6rem, 6vw, 6rem) | 0.92 | −0.045em | Section openers |
| `display-m` | clamp(2rem, 3.6vw, 3.5rem) | 1.0 | −0.035em | Card / sub-section titles |
| `title` | 1.375rem | 1.2 | −0.01em | Product names |
| `body-l` | 1.125rem | 1.6 | 0 | Intros |
| `body` | 1rem | 1.6 | 0 | Default |
| `small` | 0.875rem | 1.5 | 0 | Meta |
| `label` | 0.72rem | 1.2 | 0.32em, uppercase, weight 500 | Eyebrows, packaging captions |

## 4. Shape, depth, motion tokens

- **Radii:** `sm 10px`, `card 22px`, `panel 34px`, `pill 999px`, and `arch`
  (`999px 999px 34px 34px`). The arch is the "halo": a moon-topped frame used for the
  hero stage and the quiz result.
- **Shadows:** warm and low (`rgb(28 26 23 / …)`): `shadow-soft`, `shadow-lift`, and
  `shadow-cream` (the drop shadow under poured cream).
- **Motion:**

| Token | Value | Use |
| --- | --- | --- |
| `--dur-fast` | 180ms | Hovers, chips |
| `--dur-base` | 420ms | Drawer, tabs, card swaps |
| `--dur-slow` | 900ms | Reveals, shade smear |
| `--ease-out` | cubic-bezier(.22,1,.36,1) | Default |
| `--ease-cream` | cubic-bezier(.34,1.56,.64,1) | Overshoot for anything "liquid" |

## 5. Logo

- **Wordmark:** H A L U N A drawn as **single-weight strokes** (not a font) at the same
  thin weight and wide spacing as the packaging print, so site and product read as one
  brand.
- **The U** is drawn as a **cupped bowl**: a slightly flared U, like two hands held together,
  holding **one rounded drop of cream**. It is the only filled shape in the wordmark.
- **Variants:** horizontal wordmark (header), vertical stacked wordmark (footer and
  packaging-style rails), and the standalone **mark** (U + drop) for favicon/app icon.
- No sun circle, no horizon line, no orange dot.

## 6. Motion principles

1. **Everything behaves like cream.** Things settle with a slight overshoot
   (`--ease-cream`), never bounce.
2. **Scroll drives the big moments** (pour, blush bloom, texture text) using GSAP
   ScrollTrigger scrubs, with Lenis smoothing. Small UI responds to the pointer.
3. **One hero moment per section.** No section animates more than one idea.
4. **60fps budget:** animate only `transform`, `opacity`, `filter` on small layers, and
   SVG attributes on small paths. GSAP, ScrollTrigger and Lenis are code-split and load
   after first paint.
5. **`prefers-reduced-motion`:** no smooth scroll, no scrubs, no cursor. The hero shows
   the poured state as a still, and shade changes cross-fade only.

### Signature animations

| # | Name | Where | How |
| --- | --- | --- | --- |
| 1 | Cream pour | Hero | The tube (the real product photo, cut out with an SVG clip path) tilts over the first scroll of the pinned hero. A glossy cream stream (SVG stroke + goo filter + highlight stroke + soft shadow) pours from the cap, pools into a dollop, and the dollop stretches into the **Shop the collection** pill. Mobile plays a shorter time-based version, without pinning. |
| 2 | Gooey buttons | Primary buttons | A blob inside the pill follows the cursor through an SVG goo filter, so the fill bulges toward it; press squishes (`scale(.97,.92)`). |
| 3 | Blush bloom | Color section (Dusk) | Large blurred radial clouds in blush / dusk-rose with `mix-blend-mode: screen` scale and drift, scrubbed by scroll. |
| 4 | Shade switcher | Glow Tint, Cheek Balm, Lip & Cheek cards and product page | Card background re-tints to a shade-derived tone; a brush-stroke "smear" in the shade colour sweeps across while the photo cross-fades. |
| 5 | Vertical marquee | Shop section edge | `HALUNA — DAILY MINERAL SUNSCREEN —` scrolls slowly downward in packaging capitals. |
| 6 | Cream-drop cursor | Desktop, fine pointers only | A small cream teardrop trails the pointer and swells over links and buttons. |

## 7. Page plan (home)

1. **Announcement bar** (Dusk): `free shipping over $50 · reef-safe mineral filters`.
2. **Header:** horizontal wordmark · Shop, Sun care, Color, Ingredients, Journal ·
   live UV badge · cart. Transparent over the hero, solid Bone after scroll.
3. **Hero** (pinned): left, the vertical `H A L U N A` rail plus a huge three-line headline
   "Sun care that disappears into your skin." with two CTAs and a trust line. Right, an
   **arch stage** with a leaf-shadow crop of the campaign photography, the tilting tube,
   the cream pour, and the dollop-turned-button.
4. **UV today + Why mineral**: an asymmetric split. Left, the live UV card (Open-Meteo,
   geolocation or city picker, colour scale, recommendation, add to cart). Right, the hero
   4:5 photo with three oversized stats (0% white cast · SPF 50 · reef-safe).
5. **Shop**: an offset heading with the vertical marquee on the left edge; filter chips
   All / Sun care / Color; an asymmetric grid (the first card spans two rows). Cards swap
   to a lifestyle image on hover; quick-add; shade chips with the smear.
6. **Texture**: full-bleed `texture-cream` with a sticky, scroll-revealed line
   "Lightweight. Invisible. Yours."
7. **Color** (Dusk): blush bloom; a large Cheek Balm stage with the shade switcher; Lip &
   Cheek Tint beside it; lifestyle-2 as a tall image.
8. **Find your SPF quiz**: a playful step card (big tap targets, progress dots,
   one question per step), and a result inside an arch frame with a primary and a
   "pairs with" product.
9. **Ingredients**: horizontally scrolling macro cards (scroll-snap, arrow buttons,
   keyboard-scrollable).
10. **Reviews**: a 9:16 UGC player plus review cards in staggered masonry.
11. **FAQ** (two-column: big heading left, accordion right), **newsletter** on Dusk, and a
    **footer** with a giant vertical wordmark and the concept credit linking to
    https://damiruali014-lab.github.io.

## 8. Imagery

| File | Ratio | Use |
| --- | --- | --- |
| `hero-tube.webp` | 4:5 | Why-mineral split, OG fallback |
| `product-*.webp` | 1:1 | Cards, product gallery frame 1, cart thumbnails |
| `lifestyle-1..3.webp` | 4:5 | Card hover swap, gallery frame 3, Color section |
| `texture-cream.webp` | 16:9 | Texture section, gallery frame 2, ingredient macros (cropped) |
| `collection-banner.webp` | 16:9 | Hero stage background (leaf-shadow crop), OG image |
| `ugc-poster.webp`, `/videos/haluna-ugc.mp4` | 9:16 | Reviews player |

Large photos get generated responsive sizes (`npm run images` → `public/images/r/`).
Anything missing falls back to an SVG render of the sand packaging family.

## 9. Implementation notes

- The hero stays in view on desktop with CSS `position: sticky` (not a GSAP pin), so nothing is
  re-parented and there is no layout shift. ScrollTrigger only scrubs the pour timeline.
- Fonts are self-hosted and preloaded. Bricolage is subset to Latin with `wght 250–500` and
  `wdth 75–100` (60 kB instead of 131 kB).
- The home page is prerendered at build time and hydrated, so the hero is in the first HTML response.
- Horizontal carousels use scroll-snap **without** CSS `scroll-behavior: smooth`: that combination stops
  Chrome from reporting Largest Contentful Paint.

## 10. Accessibility and performance targets

WCAG AA text contrast (pairs checked above). Visible focus ring (`2px ink` / `2px bone`
on Dusk). Full keyboard support for the drawer, menu, quiz, tabs, accordion, filters and
carousel. Lighthouse mobile 90+: text LCP, lazy images with `srcset`, motion libraries
code-split, fonts loaded non-blocking.
