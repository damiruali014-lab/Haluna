import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { FREE_SHIPPING_THRESHOLD, defaultShade, formatPrice, products } from '../data/products'
import { useCart } from '../lib/cart'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { ProductImage } from './ProductImage'
import { GooButton } from './GooButton'
import { QuantityStepper } from './ui'
import { CloseIcon } from './Icons'

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div>
      <p className="mb-2.5 text-sm" aria-live="polite">
        {remaining > 0 ? (
          <>
            <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free shipping
          </>
        ) : (
          <strong className="font-semibold">Free shipping unlocked</strong>
        )}
      </p>
      <div
        className="h-1 overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
      >
        <div className="h-full rounded-full bg-ink transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-out)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close, setQuantity, remove, add } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  useFocusTrap(panelRef, isOpen, close)

  const suggestion = products.find((p) => !lines.some((l) => l.slug === p.slug))

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div
        className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-[var(--dur-base)] ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        data-lenis-prevent
        className={`absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-bone shadow-lift transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 id="cart-title" className="display text-display-m leading-none">
            Your bag <sup className="font-sans text-sm font-semibold tracking-normal">{count}</sup>
          </h2>
          <button type="button" onClick={close} className="-mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Close bag">
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="px-6 pb-5">
          <FreeShippingBar subtotal={subtotal} />
        </div>

        <div className="flex-1 overflow-y-auto border-t border-ink/10 px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="display text-display-m">Nothing here yet</p>
              <p className="mt-3 text-sm text-ink-soft">Your skin's next favourite thing is one tap away.</p>
              <Link to="/#shop" onClick={close} className="btn-ink mt-8">
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-5">
                  <Link to={`/product/${line.product.slug}`} onClick={close} className="block h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-sand" tabIndex={-1} aria-hidden="true">
                    <ProductImage product={line.product} shade={line.shade} sizes="96px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${line.product.slug}`} onClick={close} className="font-semibold hover:underline">
                          {line.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {line.product.size}
                          {line.shade && ` · ${line.shade.name}`}
                        </p>
                      </div>
                      <p className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} label={`${line.product.name}${line.shade ? ` ${line.shade.name}` : ''}`} />
                      <button type="button" onClick={() => remove(line.key)} className="text-xs text-ink-soft underline underline-offset-4 hover:text-ink">
                        Remove<span className="sr-only"> {line.product.name}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 && suggestion && (
            <div className="mb-6 flex items-center gap-4 rounded-card bg-sand p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                <ProductImage product={suggestion} shade={defaultShade(suggestion)} sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="label text-ink-soft">pairs well with</p>
                <p className="mt-1 truncate text-sm font-semibold">{suggestion.name}</p>
              </div>
              <button
                type="button"
                onClick={() => add(suggestion.slug, defaultShade(suggestion)?.id)}
                className="rounded-full bg-bone px-3.5 py-2 text-xs font-semibold transition hover:bg-ink hover:text-bone"
                aria-label={`Add ${suggestion.name} for ${formatPrice(suggestion.price)}`}
              >
                + {formatPrice(suggestion.price)}
              </button>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-lg font-semibold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Shipping and taxes calculated at checkout.</p>
            <GooButton
              type="button"
              className="mt-4 w-full"
              onClick={() => {
                close()
                navigate('/checkout')
              }}
            >
              Checkout · {formatPrice(subtotal)}
            </GooButton>
          </div>
        )}
      </div>
    </div>
  )
}
