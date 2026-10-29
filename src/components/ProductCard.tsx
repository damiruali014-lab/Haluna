import { useState } from 'react'
import { Link } from 'react-router'
import { formatPrice, type Product } from '../data/products'
import { useCart } from '../lib/cart'
import { ProductVisual } from './ProductVisual'
import { ShadeChips, Stars } from './ui'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [shadeId, setShadeId] = useState(product.shades?.[1]?.id ?? product.shades?.[0]?.id ?? '')
  const shade = product.shades?.find((s) => s.id === shadeId)
  const href = `/product/${product.slug}${shade ? `?shade=${shade.id}` : ''}`

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden">
        <ProductVisual
          product={product}
          shade={shade}
          className="aspect-[5/4] transition-transform duration-700 sm:aspect-[4/5] ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium backdrop-blur">
          {product.tagline}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <Stars rating={product.rating} />
          <span>
            {product.rating} ({product.reviewCount.toLocaleString('en-US')})
          </span>
        </div>
        <h3 className="mt-2 text-2xl leading-tight">
          <Link to={href} className="after:absolute after:inset-0 hover:underline focus-visible:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{product.size}</p>

        {product.shades && (
          <div className="relative z-10 mt-4">
            <ShadeChips shades={product.shades} value={shadeId} onChange={setShadeId} name={`card-shade-${product.slug}`} compact />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <p className="text-lg font-semibold tabular-nums">{formatPrice(product.price)}</p>
          <button
            type="button"
            onClick={() => add(product.slug, shade?.id)}
            className="btn-dark relative z-10 !px-5 !py-3"
            aria-label={`Add to cart: ${product.name}${shade ? `, ${shade.name}` : ''}`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
