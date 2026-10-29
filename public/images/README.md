# Images

All photos live here at their full size. After adding or replacing one, run `npm run images`
to regenerate the responsive sizes in `r/` (and the hero backdrop crop) used by `<Img>`.

| File | Ratio | Used for |
| --- | --- | --- |
| hero-tube.webp | 4:5 | "Why mineral" section |
| collection-banner.webp | 16:9 | Hero backdrop crop, shop editorial tile, OG image |
| product-sunscreen.webp | 1:1 | Daily Mineral Sunscreen, and the cut-out tube in the hero pour |
| product-tint-light / -medium / -deep.webp | 1:1 | Glow Tint shades |
| product-stick.webp | 1:1 | Sun Stick |
| product-blush-petal / -dusk / -ember.webp | 1:1 | Cheek Balm shades |
| product-liptint.webp | 1:1 | Lip & Cheek Tint, Berry |
| product-aftersun.webp | 1:1 | After-Sun Cooling Gel |
| lifestyle-1..3.webp | 4:5 | Card hover, gallery, Color section, journal |
| texture-cream.webp | 16:9 | Texture section, gallery, ingredient macros |

Still missing (the site falls back gracefully until they exist):

| File | Size | Fallback today |
| --- | --- | --- |
| product-liptint-bare.webp | 1200 × 1200, 1:1, on the sand sweep | SVG render of the vial in the Bare shade |
| ugc-poster.webp | 1080 × 1920, 9:16 | Darkened lifestyle-1 still |

Set the paths in `src/data/products.ts` (Bare shade `image`) and `src/data/site.ts` (`ugc.poster`).

Note: `product-sunscreen.webp` is cut out with a traced clip path for the hero pour
(`TUBE_CLIP` in `src/components/home/heroGeometry.ts`). If you replace that photo with a
different framing, re-trace the clip path.
