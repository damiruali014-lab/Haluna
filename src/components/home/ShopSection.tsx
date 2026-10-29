import { useSearchParams } from 'react-router'
import { CATEGORIES, products, type Category } from '../../data/products'
import { ProductCard } from '../ProductCard'
import { Img } from '../Img'
import { Reveal } from '../ui'

const COLS = 3

/** Signature animation 5: packaging capitals running slowly down the edge of the section. */
function VerticalMarquee() {
  const text = 'Haluna — daily mineral sunscreen — '
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 overflow-hidden border-r border-ink/10 xl:block">
      <div className="marquee-down flex flex-col items-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="vertical-caps py-4 text-[11px] whitespace-nowrap text-ink-soft">
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ShopSection() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('shop')
  const filter: 'all' | Category = raw === 'sun' || raw === 'color' ? raw : 'all'
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter)
  const featured = filter === 'all'
  const used = featured ? list.length + 1 : list.length
  const remainder = (COLS - (used % COLS)) % COLS

  return (
    <section id="shop" className="relative py-20 sm:py-28" aria-labelledby="shop-title">
      <VerticalMarquee />
      <div className="container-page xl:pl-24">
        <div className="mb-12 grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Reveal>
            <p className="label text-ink-soft">03 · the collection</p>
            <h2 id="shop-title" className="display mt-5 max-w-3xl text-display-l">
              Six essentials. <span className="text-ink-soft">One sand-coloured shelf.</span>
            </h2>
          </Reveal>
          <div role="group" aria-label="Filter products" className="flex gap-2">
            {CATEGORIES.map((c) => {
              const active = filter === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    const next = new URLSearchParams(params)
                    if (c.id === 'all') next.delete('shop')
                    else next.set('shop', c.id)
                    setParams(next, { replace: true, preventScrollReset: true })
                  }}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-[var(--dur-fast)] ${
                    active ? 'border-ink bg-ink text-bone' : 'border-ink/20 hover:border-ink'
                  }`}
                >
                  {c.label}
                  <span className="ml-1.5 text-xs font-normal opacity-70">
                    {c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <ul key={filter} className="grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" aria-live="polite">
          {list.map((p, i) => (
            <li key={p.slug} className={featured && i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
              <ProductCard product={p} featured={featured && i === 0} />
            </li>
          ))}
          {remainder > 0 && (
            <li
              aria-hidden="true"
              className={`relative hidden overflow-hidden rounded-card lg:block ${remainder === 2 ? 'lg:col-span-2' : ''}`}
            >
              <Img
                src={filter === 'color' ? '/images/lifestyle-2.webp' : '/images/collection-banner.webp'}
                alt=""
                sizes="60vw"
                className="absolute inset-0 h-full w-full object-cover object-right"
              />
              <p className="display absolute bottom-6 left-7 max-w-xs text-[1.9rem] leading-tight text-ink">
                Every formula starts at the tube. Nothing more than skin needs.
              </p>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
