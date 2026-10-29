import { useState } from 'react'
import { Link } from 'react-router'
import { formatPrice, getProduct } from '../../data/products'
import { useCart } from '../../lib/cart'
import { loadMotion } from '../../motion/load'
import { Img } from '../Img'
import { ProductImage } from '../ProductImage'
import { ShadeSmear } from '../ProductCard'
import { GooButton } from '../GooButton'
import { Reveal, ShadeChips, useNearViewport } from '../ui'

function useShade(slug: string) {
  const product = getProduct(slug)!
  const [id, setId] = useState(product.shades![0].id)
  const [run, setRun] = useState('')
  const shade = product.shades!.find((s) => s.id === id)!
  return { product, shade, id, run, pick: (next: string) => (setId(next), setRun(`${next}-${Date.now()}`)) }
}

/** The colour line on Dusk, with the blush bloom behind it. */
export function ColorSection() {
  const { add } = useCart()
  const blush = useShade('cheek-balm-blush')
  const tint = useShade('lip-cheek-tint-spf-15')

  const ref = useNearViewport((el) => {
    let cleanup: (() => void) | undefined
    let dead = false
    loadMotion().then((m) => {
      if (m && !dead) cleanup = m.blushBloom(el)
    })
    return () => {
      dead = true
      cleanup?.()
    }
  }, '400px')

  return (
    <section
      id="color"
      ref={ref as React.RefObject<HTMLElement>}
      className="on-dusk relative isolate overflow-clip bg-dusk py-24 text-bone sm:py-32"
      aria-labelledby="color-title"
    >
      {/* Blush bloom (signature animation 3). Static soft clouds when motion is reduced. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div data-bloom className="absolute top-[8%] left-[-10%] h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgba(229,154,155,0.55)_0%,rgba(229,154,155,0)_65%)] mix-blend-screen will-change-transform" />
        <div data-bloom className="absolute top-[30%] right-[-12%] h-[55vw] max-h-[700px] w-[55vw] max-w-[700px] rounded-full bg-[radial-gradient(circle,rgba(180,117,125,0.6)_0%,rgba(180,117,125,0)_65%)] mix-blend-screen will-change-transform" />
        <div data-bloom className="absolute bottom-[-10%] left-[30%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full bg-[radial-gradient(circle,rgba(217,118,94,0.35)_0%,rgba(217,118,94,0)_65%)] mix-blend-screen will-change-transform" />
      </div>

      <div className="container-page">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]">
          <Reveal>
            <p className="label text-dusk-soft">05 · the colour line</p>
            <h2 id="color-title" className="display mt-5 text-display-l">
              Colour that looks like a <span className="text-blush">flush</span>, not makeup.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-sm text-body-l text-dusk-soft">Balm blush and a watercolour stain, made in the same sand packaging and the same skin-first spirit.</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Cheek Balm stage */}
          <Reveal className="lg:col-span-7">
            <div
              className="relative overflow-hidden rounded-arch transition-colors duration-[var(--dur-slow)]"
              style={{ backgroundColor: blush.shade.tint }}
            >
              <div className="relative aspect-[5/5.4] sm:aspect-[5/4.2]">
                {blush.product.shades!.map((s) => (
                  <div key={s.id} className={`absolute inset-0 transition-opacity duration-[var(--dur-slow)] ${s.id === blush.id ? 'opacity-100' : 'opacity-0'}`}>
                    <ProductImage product={blush.product} shade={s} sizes="(min-width: 1024px) 55vw, 95vw" />
                  </div>
                ))}
                <div aria-hidden="true" className="absolute inset-0 opacity-50 mix-blend-multiply transition-colors duration-[var(--dur-slow)]" style={{ backgroundColor: blush.shade.tint }} />
                <ShadeSmear color={blush.shade.swatch} runKey={blush.run} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="label text-dusk-soft">cheek balm · {formatPrice(blush.product.price)}</p>
                <p className="display mt-2 text-[2.2rem] leading-none">{blush.product.name}</p>
                <div className="mt-5">
                  <ShadeChips shades={blush.product.shades!} value={blush.id} onChange={blush.pick} name="color-blush" tone="bone" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/product/${blush.product.slug}?shade=${blush.id}`} className="text-sm font-semibold underline underline-offset-4 hover:text-blush">
                  Details
                </Link>
                <GooButton variant="bone" type="button" onClick={() => add(blush.product.slug, blush.id)}>
                  Add {blush.shade.name}
                </GooButton>
              </div>
            </div>
          </Reveal>

          {/* Lifestyle + Lip & Cheek Tint */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
            <Reveal delay={80} className="relative overflow-hidden rounded-panel">
              <Img src="/images/lifestyle-2.webp" alt="Three open pots of Haluna cheek balm on warm stone beside a pink silk scarf" sizes="(min-width: 1024px) 38vw, 90vw" className="aspect-[4/3.4] h-full w-full object-cover" />
            </Reveal>
            <Reveal delay={160} className="flex gap-5 rounded-panel bg-dusk-deep/70 p-5 ring-1 ring-bone/10">
              <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-card" style={{ backgroundColor: tint.shade.tint }}>
                {tint.product.shades!.map((s) => (
                  <div key={s.id} className={`absolute inset-0 transition-opacity duration-[var(--dur-slow)] ${s.id === tint.id ? 'opacity-100' : 'opacity-0'}`}>
                    <ProductImage product={tint.product} shade={s} sizes="112px" />
                  </div>
                ))}
                <ShadeSmear color={tint.shade.swatch} runKey={tint.run} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="label text-dusk-soft">lip &amp; cheek tint</p>
                <p className="mt-2 text-lg font-semibold">{tint.product.name}</p>
                <p className="mt-1 text-sm text-dusk-soft">{tint.product.size} · {formatPrice(tint.product.price)}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <ShadeChips shades={tint.product.shades!} value={tint.id} onChange={tint.pick} name="color-tint" tone="bone" compact />
                  <button
                    type="button"
                    onClick={() => add(tint.product.slug, tint.id)}
                    className="rounded-full bg-bone px-4 py-2 text-xs font-semibold text-ink transition hover:bg-blush"
                    aria-label={`Add ${tint.product.name}, ${tint.shade.name}`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
