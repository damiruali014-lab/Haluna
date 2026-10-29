import { useState } from 'react'
import { Link } from 'react-router'
import { formatPrice, type Product } from '../data/products'
import { useCart } from '../lib/cart'
import { Img } from './Img'
import { ProductImage } from './ProductImage'
import { PlusIcon } from './Icons'
import { ShadeChips, Stars } from './ui'

/** Signature animation 4: a brush-stroke "smear" in the new shade, swept across the image on shade change. */
export function ShadeSmear({ color, runKey }: { color: string; runKey: string }) {
  if (!runKey) return null
  return (
    <svg
      key={runKey}
      aria-hidden="true"
      viewBox="0 0 400 90"
      preserveAspectRatio="none"
      className="smear pointer-events-none absolute top-[66%] left-[-6%] z-10 h-[18%] w-[112%] -rotate-6"
    >
      <path d="M6 52C40 22 92 14 150 20s110 2 160-8 78 6 84 22-12 30-46 36-96 0-150 4-112 18-160 10S-14 74 6 52Z" fill={color} opacity="0.92" />
    </svg>
  )
}

/** Card background: the selected shade's tint, mint for the after-sun gel, otherwise sand. */
export function cardTone(product: Product, tint?: string) {
  if (tint) return tint
  if (product.packColor === '#C9D6D2') return '#E1E6E1'
  return 'var(--color-sand)'
}

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { add } = useCart()
  const [shadeId, setShadeId] = useState(product.shades?.[0]?.id ?? '')
  const [smearKey, setSmearKey] = useState('')
  const shade = product.shades?.find((s) => s.id === shadeId)
  const href = `/product/${product.slug}${shade ? `?shade=${shade.id}` : ''}`
  const sizes = featured ? '(min-width: 1024px) 40vw, 90vw' : '(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw'

  const pickShade = (id: string) => {
    setShadeId(id)
    setSmearKey(`${id}-${Date.now()}`)
  }

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-card transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out)]"
      style={{ backgroundColor: cardTone(product, shade?.tint) }}
    >
      <div className={`relative overflow-hidden ${featured ? 'aspect-square lg:aspect-auto lg:min-h-[420px] lg:flex-1' : 'aspect-square'}`}>
        {/* Every shade is stacked so switching cross-fades instead of flashing. */}
        {(product.shades ?? [undefined]).map((s) => (
          <div
            key={s?.id ?? 'base'}
            className={`absolute inset-0 transition-opacity duration-[var(--dur-slow)] ${!s || s.id === shadeId ? 'opacity-100' : 'opacity-0'}`}
          >
            <ProductImage product={product} shade={s} sizes={sizes} />
          </div>
        ))}
        {/* Shade re-tint: the photo's sand sweep takes on the selected shade. */}
        {shade && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply transition-colors duration-[var(--dur-slow)]"
            style={{ backgroundColor: shade.tint }}
          />
        )}
        {/* Hover swap to the lifestyle shot (hover-capable pointers only). */}
        <div className="pointer-events-none absolute inset-0 scale-105 opacity-0 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100">
          <Img src={product.lifestyle} alt="" sizes={sizes} className="h-full w-full object-cover" />
        </div>
        {shade && <ShadeSmear color={shade.swatch} runKey={smearKey} />}

        {product.badge && <span className="label absolute top-4 left-4 z-10 rounded-full bg-bone/90 px-3 py-1.5 !text-[10px]">{product.badge}</span>}
        <button
          type="button"
          onClick={() => add(product.slug, shade?.id)}
          className="absolute right-4 bottom-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-ink text-bone shadow-soft transition duration-[var(--dur-base)] ease-[var(--ease-cream)] hover:scale-110 focus-visible:translate-y-0 focus-visible:opacity-100 active:scale-90 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
          aria-label={`Quick add: ${product.name}${shade ? `, ${shade.name}` : ''}, ${formatPrice(product.price)}`}
        >
          <PlusIcon size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-ink-soft">{product.descriptor}</p>
            <h3 className="mt-2 font-sans text-title font-semibold tracking-tight [font-stretch:100%]">
              <Link to={href} className="after:absolute after:inset-0 hover:underline hover:decoration-1 hover:underline-offset-4">
                {product.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 text-base font-semibold tabular-nums">{formatPrice(product.price)}</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          {product.shades ? (
            <ShadeChips shades={product.shades} value={shadeId} onChange={pickShade} name={`card-${product.slug}`} compact />
          ) : (
            <span className="text-xs text-ink-soft">{product.size}</span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Stars rating={product.rating} size={11} />
            {product.rating} ({product.reviewCount.toLocaleString('en-US')})
          </span>
        </div>
      </div>
    </article>
  )
}
