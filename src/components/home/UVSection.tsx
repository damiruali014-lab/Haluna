import { getProduct, formatPrice } from '../../data/products'
import { CITIES, loadUV, locateMe, useUV, uvLevel } from '../../lib/uv'
import { useCart } from '../../lib/cart'
import { Img } from '../Img'
import { ProductImage } from '../ProductImage'
import { GooButton } from '../GooButton'
import { Reveal } from '../ui'

const SCALE = 'linear-gradient(90deg, #C9D6D2 0%, #D8C3A8 22%, #E59A9B 52%, #9A4F55 76%, #4A2B3A 100%)'

function UVCard() {
  const uv = useUV()
  const { add } = useCart()
  const value = uv.uv
  const level = value !== undefined ? uvLevel(value) : null
  const product = level ? getProduct(level.productSlug) : undefined
  const shade = product?.shades?.[1] ?? product?.shades?.[0]
  const isLoading = uv.status === 'loading' || uv.status === 'idle'
  const selectValue = CITIES.some((c) => c.id === uv.place.id) ? uv.place.id : ''

  return (
    <div className="relative flex h-full flex-col rounded-panel bg-sand p-6 sm:p-9" aria-busy={isLoading}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label">UV index today</p>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="uv-city" className="sr-only">
            Choose a city
          </label>
          <select
            id="uv-city"
            value={selectValue}
            onChange={(e) => {
              const city = CITIES.find((c) => c.id === e.target.value)
              if (city) loadUV(city)
            }}
            className="rounded-full border border-ink/20 bg-bone py-2 pr-8 pl-4 text-sm font-medium"
          >
            {!selectValue && <option value="">{uv.place.label}</option>}
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => locateMe()} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium transition hover:border-ink">
            Use my location
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-end gap-5" aria-live="polite">
        <p className={`display text-[clamp(6rem,14vw,10rem)] leading-[0.8] tabular-nums transition-opacity ${isLoading ? 'opacity-30' : ''}`}>
          {value !== undefined ? Math.round(value) : '–'}
        </p>
        <div className="pb-2">
          <p className="text-title font-semibold">{level ? level.label : isLoading ? 'Checking the sky…' : 'Unavailable'}</p>
          <p className="text-sm text-ink-soft">{uv.place.label} · today's max</p>
        </div>
      </div>

      {/* Colour scale 0–11+ */}
      <div className="mt-7">
        <div className="relative h-2.5 rounded-full" style={{ background: SCALE }} aria-hidden="true">
          {value !== undefined && (
            <span
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-bone bg-ink shadow-soft transition-[left] duration-[var(--dur-slow)] ease-[var(--ease-cream)]"
              style={{ left: `${Math.min(100, (value / 11) * 100)}%` }}
            />
          )}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-ink-soft" aria-hidden="true">
          <span>0 low</span>
          <span>3</span>
          <span>6 high</span>
          <span>8</span>
          <span>11+ extreme</span>
        </div>
      </div>

      {uv.status === 'error' && (
        <p role="alert" className="mt-6 rounded-sm bg-bone px-4 py-3 text-sm">
          {uv.message}{' '}
          <button type="button" className="font-semibold underline underline-offset-4" onClick={() => loadUV()}>
            Try again
          </button>
        </p>
      )}

      {level && value !== undefined && product && (
        <div className="mt-auto pt-8">
          <p className="display text-[1.75rem] leading-tight">
            UV {Math.round(value)}, {level.label.toLowerCase()}. {level.advice}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-card bg-bone p-3 sm:flex-nowrap sm:pr-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-sand">
              <ProductImage product={product} shade={shade} sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="label text-ink-soft">recommended</p>
              <p className="mt-1 truncate text-sm font-semibold">{product.name}</p>
            </div>
            <GooButton type="button" className="!px-5 !py-3 max-sm:w-full" onClick={() => add(product.slug, shade?.id)} aria-label={`Add ${product.name} to bag, ${formatPrice(product.price)}`}>
              Add · {formatPrice(product.price)}
            </GooButton>
          </div>
        </div>
      )}
      <p className="mt-5 text-[11px] text-ink-soft">
        Live forecast from{' '}
        <a href="https://open-meteo.com" target="_blank" rel="noopener" className="underline underline-offset-2">
          Open-Meteo
        </a>
        .
      </p>
    </div>
  )
}

const STATS = [
  { big: '0%', label: 'white cast', note: 'Micronised zinc spreads clear on every skin tone.' },
  { big: 'SPF 50', label: 'broad spectrum', note: 'UVA and UVB, from a single gentle mineral.' },
  { big: 'Reef', label: 'safe filters', note: 'No oxybenzone, no octinoxate. Ever.' },
]

export function UVSection() {
  return (
    <section id="uv" className="py-20 sm:py-28" aria-labelledby="mineral-title">
      <div className="container-page grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <Reveal>
          <UVCard />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <Reveal delay={100} className="relative overflow-hidden rounded-panel bg-sand">
            <Img src="/images/hero-tube.webp" alt="Daily Mineral Sunscreen standing on a stone plinth in dappled afternoon light" sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw" className="h-full w-full object-cover" />
          </Reveal>
          <div className="flex flex-col justify-between gap-10 py-2">
            <Reveal>
              <p className="label text-ink-soft">02 · why mineral</p>
              <h2 id="mineral-title" className="display mt-5 text-display-m">
                Protection that sits light, not heavy.
              </h2>
            </Reveal>
            <dl className="divide-y divide-ink/12 border-y border-ink/12">
              {STATS.map((s, i) => (
                <Reveal key={s.big} delay={i * 90} className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-5">
                  <dt className="display text-[clamp(2.6rem,4.6vw,4.2rem)] leading-none">{s.big}</dt>
                  <dd>
                    <span className="label block">{s.label}</span>
                    <span className="mt-1.5 block text-sm text-ink-soft">{s.note}</span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
