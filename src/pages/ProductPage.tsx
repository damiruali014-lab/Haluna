import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { FREE_SHIPPING_THRESHOLD, formatPrice, getProduct, products } from '../data/products'
import { useCart } from '../lib/cart'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ProductVisual } from '../components/ProductVisual'
import { ProductCard } from '../components/ProductCard'
import { CheckIcon } from '../components/Icons'
import { QuantityStepper, Reveal, ShadeChips, Stars } from '../components/ui'
import NotFound from './NotFound'

const TABS = ['Benefits', 'Ingredients', 'How to use'] as const

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  // Remount on product change so gallery/shade/quantity state resets.
  return product ? <ProductDetail key={product.slug} slug={product.slug} /> : <NotFound />
}

function ProductDetail({ slug }: { slug: string }) {
  const product = getProduct(slug)!
  const [params, setParams] = useSearchParams()
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [view, setView] = useState<0 | 1 | 2>(0)
  const [tab, setTab] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()

  const shadeId = product.shades?.some((s) => s.id === params.get('shade'))
    ? params.get('shade')!
    : (product.shades?.[1]?.id ?? product.shades?.[0]?.id)
  const shade = product.shades?.find((s) => s.id === shadeId)

  useDocumentMeta(`${product.name} (${product.size})`, `${product.description} ${formatPrice(product.price)}.`)

  const others = products.filter((p) => p.slug !== product.slug)

  const onTabKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    let next = tab
    if (dir) next = (tab + dir + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return
    e.preventDefault()
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <>
      <div className="container-page pt-6 pb-20 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/#shop" className="hover:text-ink">Shop</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{product.shortName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductVisual product={product} shade={shade} variant={view} priority className="aspect-[4/5] rounded-panel sm:aspect-square" />
            <div className="mt-4 grid grid-cols-3 gap-3" role="group" aria-label="Product images">
              {([0, 1, 2] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`overflow-hidden rounded-2xl ring-2 transition ${view === v ? 'ring-ink' : 'ring-transparent hover:ring-ink/30'}`}
                >
                  <span className="sr-only">Show image {v + 1} of 3</span>
                  <span aria-hidden="true">
                    <ProductVisual product={product} shade={shade} variant={v} className="pointer-events-none aspect-square" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div>
            <p className="eyebrow">{product.tagline}</p>
            <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
            <a href="#product-reviews" className="mt-4 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <Stars rating={product.rating} />
              <span>
                {product.rating} · {product.reviewCount.toLocaleString('en-US')} reviews
              </span>
            </a>
            <p className="mt-5 text-2xl font-semibold tabular-nums">
              {formatPrice(product.price)} <span className="text-base font-normal text-ink-soft">/ {product.size}</span>
            </p>
            <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">{product.description}</p>

            {product.shades && shadeId && (
              <div className="mt-8">
                <ShadeChips
                  shades={product.shades}
                  value={shadeId}
                  onChange={(id) => setParams({ shade: id }, { replace: true, preventScrollReset: true })}
                  name="pdp-shade"
                />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} label={product.name} />
              <button type="button" className="btn-primary flex-1 !py-4 sm:flex-none sm:!px-10" onClick={() => add(product.slug, shade?.id, qty)}>
                Add to cart · {formatPrice(product.price * qty)}
              </button>
            </div>

            <ul className="mt-6 grid gap-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <CheckIcon size={16} className="text-sage-deep" /> Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={16} className="text-sage-deep" /> 30-day love-it-or-return-it guarantee
              </li>
            </ul>

            {/* Tabs */}
            <div className="mt-10">
              <div role="tablist" aria-label="Product information" className="flex gap-1 border-b border-ink/10">
                {TABS.map((t, i) => (
                  <button
                    key={t}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    role="tab"
                    type="button"
                    id={`${uid}-tab-${i}`}
                    aria-selected={tab === i}
                    aria-controls={`${uid}-panel-${i}`}
                    tabIndex={tab === i ? 0 : -1}
                    onClick={() => setTab(i)}
                    onKeyDown={onTabKey}
                    className={`-mb-px border-b-2 px-3 py-3 text-sm font-medium transition sm:px-4 ${
                      tab === i ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {TABS.map((t, i) => (
                <div
                  key={t}
                  role="tabpanel"
                  id={`${uid}-panel-${i}`}
                  aria-labelledby={`${uid}-tab-${i}`}
                  hidden={tab !== i}
                  tabIndex={0}
                  className="animate-fade-in py-6"
                >
                  {i === 0 && (
                    <ul className="space-y-3">
                      {product.benefits.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun-soft text-sun-deep">
                            <CheckIcon size={14} />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {i === 1 && (
                    <dl className="space-y-4">
                      {product.ingredients.map((ing) => (
                        <div key={ing.name}>
                          <dt className="font-medium">{ing.name}</dt>
                          <dd className="text-sm text-ink-soft">{ing.note}</dd>
                        </div>
                      ))}
                      <p className="pt-2 text-xs text-ink-soft">Fragrance-free · Oxybenzone-free · Octinoxate-free · Vegan · Cruelty-free</p>
                    </dl>
                  )}
                  {i === 2 && (
                    <ol className="space-y-3">
                      {product.howToUse.map((s, n) => (
                        <li key={s} className="flex gap-3">
                          <span className="font-display text-xl leading-6 text-sun-deep">{n + 1}</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>

            <div id="product-reviews" className="rounded-panel bg-sand-soft p-6">
              <div className="flex items-center gap-3">
                <p className="font-display text-4xl leading-none">{product.rating}</p>
                <div>
                  <Stars rating={product.rating} size={16} />
                  <p className="text-xs text-ink-soft">{product.reviewCount.toLocaleString('en-US')} verified reviews</p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed">"Feels like nothing, exactly as promised. I forget I'm wearing it."</p>
              <p className="mt-2 text-sm text-ink-soft">Lena M., verified buyer</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white/60 py-20" aria-labelledby="related-title">
        <div className="container-page">
          <h2 id="related-title" className="mb-10 text-4xl">You may also like</h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl">
            {others.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
