import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { FREE_SHIPPING_THRESHOLD, formatPrice, getProduct, products } from '../data/products'
import { useCart } from '../lib/cart'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ProductImage } from '../components/ProductImage'
import { ProductCard, ShadeSmear, cardTone } from '../components/ProductCard'
import { Img } from '../components/Img'
import { GooButton } from '../components/GooButton'
import { CheckIcon } from '../components/Icons'
import { QuantityStepper, Reveal, ShadeChips, Stars } from '../components/ui'
import NotFound from './NotFound'

const TABS = ['Benefits', 'Ingredients', 'How to use'] as const
const FRAMES = ['Product', 'Texture', 'In the light'] as const

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
  const [frame, setFrame] = useState(0)
  const [seen, setSeen] = useState<number[]>([0])
  const [tab, setTab] = useState(0)
  const [smear, setSmear] = useState('')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()

  const shadeId = product.shades?.some((s) => s.id === params.get('shade')) ? params.get('shade')! : product.shades?.[0]?.id
  const shade = product.shades?.find((s) => s.id === shadeId)

  useDocumentMeta(`${product.name} (${product.size})`, `${product.description} ${formatPrice(product.price)}.`)

  const others = products.filter((p) => p.slug !== product.slug && p.category === product.category).concat(products.filter((p) => p.category !== product.category)).slice(0, 3)

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

  const frameView = (i: number, thumb = false) => {
    const sizes = thumb ? '120px' : '(min-width: 1024px) 55vw, 95vw'
    if (i === 0)
      return (
        <div className="relative h-full w-full">
          {(product.shades ?? [undefined]).map((s) => (
            <div key={s?.id ?? 'base'} className={`absolute inset-0 transition-opacity duration-[var(--dur-slow)] ${!s || s.id === shadeId ? 'opacity-100' : 'opacity-0'}`}>
              <ProductImage product={product} shade={s} sizes={sizes} priority={!thumb && (!s || s.id === shadeId)} />
            </div>
          ))}
          {shade && <div aria-hidden="true" className="absolute inset-0 opacity-50 mix-blend-multiply transition-colors duration-[var(--dur-slow)]" style={{ backgroundColor: shade.tint }} />}
        </div>
      )
    if (i === 1) return <Img src={product.texture} alt={thumb ? '' : `Texture of ${product.name}`} sizes={sizes} className="h-full w-full object-cover" />
    return <Img src={product.lifestyle} alt={thumb ? '' : `${product.name} in an afternoon-light setting`} sizes={sizes} className="h-full w-full object-cover" />
  }

  return (
    <>
      <div className="container-page pt-6 pb-20 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-ink">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/?shop=${product.category}#shop`} className="hover:text-ink">
                {product.category === 'sun' ? 'Sun care' : 'Color'}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          {/* Gallery: product, texture, lifestyle */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-panel transition-colors duration-[var(--dur-slow)]" style={{ backgroundColor: cardTone(product, shade?.tint) }}>
              {FRAMES.map((_, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-[var(--dur-base)] ${frame === i ? 'opacity-100' : 'opacity-0'}`} aria-hidden={frame !== i}>
                  {seen.includes(i) && frameView(i)}
                </div>
              ))}
              {shade && frame === 0 && <ShadeSmear color={shade.swatch} runKey={smear} />}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3" role="group" aria-label="Product images">
              {FRAMES.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setFrame(i)
                    setSeen((v) => (v.includes(i) ? v : [...v, i]))
                  }}
                  aria-pressed={frame === i}
                  className={`group overflow-hidden rounded-card text-left ring-2 transition ${frame === i ? 'ring-ink' : 'ring-transparent hover:ring-ink/30'}`}
                >
                  <span className="sr-only">Show {label.toLowerCase()} image</span>
                  <span aria-hidden="true" className="relative block aspect-[4/3] bg-sand">
                    {frameView(i, true)}
                  </span>
                  <span aria-hidden="true" className="label block bg-bone px-3 py-2 !text-[10px] text-ink-soft">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div>
            <p className="label text-ink-soft">
              {product.descriptor}
              {product.spf ? ` · spf ${product.spf}` : ''} · {product.size}
            </p>
            <h1 className="display mt-4 text-display-l">{product.name}</h1>
            <a href="#product-reviews" className="mt-5 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <Stars rating={product.rating} />
              {product.rating} · {product.reviewCount.toLocaleString('en-US')} reviews
            </a>
            <p className="mt-6 text-[1.75rem] font-semibold tabular-nums">{formatPrice(product.price)}</p>
            <p className="mt-5 max-w-lg text-body-l text-ink-soft">{product.description}</p>

            {product.shades && shadeId && (
              <div className="mt-8">
                <ShadeChips
                  shades={product.shades}
                  value={shadeId}
                  onChange={(id) => {
                    setParams({ shade: id }, { replace: true, preventScrollReset: true })
                    setFrame(0)
                    setSmear(`${id}-${Date.now()}`)
                  }}
                  name="pdp-shade"
                />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} label={product.name} />
              <GooButton type="button" className="flex-1 !py-[1.05rem] sm:flex-none sm:!px-12" onClick={() => add(product.slug, shade?.id, qty)}>
                Add to bag · {formatPrice(product.price * qty)}
              </GooButton>
            </div>

            <ul className="mt-6 grid gap-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <CheckIcon size={16} /> Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon size={16} /> 30-day love-it-or-return-it
              </li>
            </ul>

            <div className="mt-12">
              <div role="tablist" aria-label="Product information" className="flex gap-6 border-b border-ink/15">
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
                    className={`-mb-px border-b-2 py-3 text-sm font-semibold transition ${tab === i ? 'border-ink text-ink' : 'border-transparent text-ink-soft hover:text-ink'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {TABS.map((t, i) => (
                <div key={t} role="tabpanel" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} hidden={tab !== i} tabIndex={0} className="animate-fade-in py-7">
                  {i === 0 && (
                    <ul className="space-y-4">
                      {product.benefits.map((b, n) => (
                        <li key={b} className="flex items-baseline gap-4">
                          <span className="display text-2xl text-rosewood tabular-nums">0{n + 1}</span>
                          <span className="text-body-l">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {i === 1 && (
                    <dl className="space-y-5">
                      {product.ingredients.map((ing) => (
                        <div key={ing.name}>
                          <dt className="font-semibold">{ing.name}</dt>
                          <dd className="text-sm text-ink-soft">{ing.note}</dd>
                        </div>
                      ))}
                      <p className="label pt-2 text-ink-soft">fragrance-free · vegan · cruelty-free</p>
                    </dl>
                  )}
                  {i === 2 && (
                    <ol className="space-y-4">
                      {product.howToUse.map((s, n) => (
                        <li key={s} className="flex gap-4">
                          <span className="display text-2xl leading-6 text-rosewood">{n + 1}</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>

            <div id="product-reviews" className="rounded-panel bg-sand p-7">
              <div className="flex items-center gap-4">
                <p className="display text-[3.5rem] leading-none">{product.rating}</p>
                <div>
                  <Stars rating={product.rating} size={15} />
                  <p className="mt-1 text-xs text-ink-soft">{product.reviewCount.toLocaleString('en-US')} verified reviews</p>
                </div>
              </div>
              <p className="display mt-5 text-[1.6rem] leading-tight">"Feels like nothing, exactly as promised. I forget I'm wearing it."</p>
              <p className="mt-3 text-sm text-ink-soft">Lena M., verified buyer</p>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-ink/10 py-20" aria-labelledby="related-title">
        <div className="container-page">
          <h2 id="related-title" className="display mb-10 text-display-m">
            You may also like
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
