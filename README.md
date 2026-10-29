# Haluna: concept sun-care store

A demo direct-to-consumer storefront for **Haluna**, a fictional sunscreen brand.
Built by [Damir Uali](https://damiruali014-lab.github.io) as a portfolio piece and a
reusable template for small e-commerce brands. **Not a real store: no payments are processed.**

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router 7. No backend.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve dist/ locally
npm run og        # regenerate public/og-image.png
```

## Make it your own

| What | Where |
| --- | --- |
| Products, prices, copy, shades, product photos | `src/data/products.ts` |
| Hero image, review video, poster | `src/data/site.ts` |
| Ingredients, reviews, FAQ | `src/data/content.ts` |
| Colours, fonts, radii, shadows | `@theme` block in `src/index.css` |
| Free-shipping threshold / fee | `FREE_SHIPPING_THRESHOLD`, `SHIPPING_FEE` in `products.ts` |

Swapping a placeholder bottle for a real photo is one line, e.g. in `products.ts`:

```ts
image: '/images/fluid-spf50.webp',
```

For Glow Tint, set `image` on each shade instead. See `public/images/README.md`
and `public/videos/README.md` for exact file names and pixel sizes.

## Structure

```
src/
  components/      Header, CartDrawer, Footer, ProductCard, ProductVisual, ui, home/*
  pages/           Home, ProductPage, Checkout (+ confirmation), NotFound
  data/            products.ts, content.ts, site.ts
  hooks/           useReveal, useFocusTrap, useDocumentMeta
  lib/cart.tsx     cart state, persisted to localStorage
```

## Deploy to Vercel

`vercel.json` already rewrites all routes to `index.html` so `/product/...` and
`/checkout` work on refresh. Vercel auto-detects Vite (build `npm run build`, output `dist`).

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
absolute URL (e.g. `https://haluna.vercel.app/og-image.png`) so link previews work on
every social platform.
