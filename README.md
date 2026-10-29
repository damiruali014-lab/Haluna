# Haluna: concept clean-beauty store

A demo direct-to-consumer storefront for **Haluna** (halo + luna), a fictional mineral sun care and
soft-colour brand. Built by [Damir Uali](https://damiruali014-lab.github.io) as the showcase for a
Premium web package. **Not a real store: no payments are processed.**

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router 7 · GSAP + ScrollTrigger · Lenis. No backend.
Design direction, tokens and motion principles: [DESIGN.md](DESIGN.md).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check, client build, then prerender the home page into dist/index.html
npm run preview   # serve dist/ locally
npm run images    # regenerate responsive image sizes after adding/replacing photos
npm run og        # regenerate public/og-image.png
```

## Make it your own

| What | Where |
| --- | --- |
| Colours, type scale, radii, shadows, motion durations | `src/styles/tokens.css` (single source of truth) |
| Products, prices, shades, photos | `src/data/products.ts` |
| Ingredients, reviews, FAQ, journal | `src/data/content.ts` |
| UGC video and poster | `src/data/site.ts` |
| Logo (stroke-drawn wordmark, vertical wordmark, mark) | `src/components/Logo.tsx` |

## Structure

```
src/
  styles/tokens.css   design tokens (CSS variables + Tailwind theme) and self-hosted fonts
  components/         Header, CartDrawer, Footer, ProductCard, Logo, GooButton, CreamCursor, Img…
  components/home/    Hero (cream pour), UVSection, ShopSection, TextureSection, ColorSection,
                      Quiz, Ingredients, Reviews, FaqNewsletter
  motion/             GSAP/Lenis engine, loaded lazily after page load (heroPour, scenes)
  pages/              Home, ProductPage, Checkout (+ confirmation), Journal, NotFound
  data/               products, content, site, image-sizes.json (generated)
  lib/                cart (localStorage), uv (Open-Meteo), scroll helpers
  entry-server.tsx    build-time prerender of the home page
```

## Notes

- **Live UV:** the UV card and header badge call the free [Open-Meteo](https://open-meteo.com) API
  (no key). Geolocation is only requested when the visitor presses "Use my location".
- **Motion:** every animation is disabled or reduced with `prefers-reduced-motion`. GSAP, ScrollTrigger
  and Lenis live in a separate chunk that loads after the page has finished loading.
- **Prerendering:** the home page HTML is generated at build time and hydrated in the browser, so the
  hero paints before JavaScript runs. Other routes are served `dist/app.html` (an empty shell) through
  `vercel.json`.

## Deploy to Vercel

`vercel.json` serves the prerendered home page at `/` and rewrites every other route to the
`app.html` shell, so `/product/...`, `/checkout` and `/journal` work on refresh. Vercel auto-detects Vite (build `npm run build`, output `dist`).

**CLI**

```bash
npm i -g vercel
vercel          # first run: link/create the project, deploys a preview
vercel --prod   # deploy to production
```

**GitHub import**

1. Push this repo to GitHub.
2. In Vercel: *Add New → Project → Import* the repo.
3. Keep the detected settings (Framework: Vite, Build: `npm run build`, Output: `dist`) and deploy.
   Every push to `main` then redeploys automatically.

After the first deploy, change `og:image` / `twitter:image` in `index.html` to the
absolute URL (currently `https://haluna-ten.vercel.app/og-image.png`) so link previews work on
every social platform.
