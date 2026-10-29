import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { FREE_SHIPPING_THRESHOLD, formatPrice, products } from '../data/products'
import { useCart } from '../lib/cart'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { ProductVisual } from './ProductVisual'
import { QuantityStepper } from './ui'
import { CloseIcon, TrashIcon } from './Icons'

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div>
      <p className="mb-2 text-sm" aria-live="polite">
        {remaining > 0 ? (
          <>
            You're <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free shipping
          </>
        ) : (
          <strong className="font-semibold text-sage-deep">You've unlocked free shipping ☀︎</strong>
        )}
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-sand"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${remaining > 0 ? 'bg-sun' : 'bg-sage'}`}
          style={{ width: `${pct}%` }}
        />
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
        className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-lift transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 id="cart-title" className="text-2xl">
            Your bag <span className="font-sans text-base text-ink-soft">({count})</span>
          </h2>
          <button type="button" onClick={close} className="-mr-2 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Close cart">
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="border-b border-ink/10 px-6 py-4">
          <FreeShippingBar subtotal={subtotal} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl">Your bag is empty</p>
              <p className="mt-2 text-sm text-ink-soft">Your skin's next favourite thing is a click away.</p>
              <Link to="/#shop" onClick={close} className="btn-dark mt-6">
                Shop sunscreens
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-4">
                  <Link
                    to={`/product/${line.product.slug}`}
                    onClick={close}
                    className="block shrink-0 overflow-hidden rounded-xl"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <ProductVisual product={line.product} shade={line.shade} className="h-24 w-20" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${line.product.slug}`} onClick={close} className="font-medium hover:underline">
                          {line.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {line.product.size}
                          {line.shade && ` · Shade: ${line.shade.name}`}
                        </p>
                      </div>
                      <p className="font-medium tabular-nums">{formatPrice(line.lineTotal)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper
                        size="sm"
                        value={line.quantity}
                        onChange={(q) => setQuantity(line.key, q)}
                        label={`${line.product.name}${line.shade ? ` ${line.shade.name}` : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                      >
                        <TrashIcon size={14} />
                        Remove<span className="sr-only"> {line.product.name}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 && suggestion && (
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-sand-soft p-3">
              <ProductVisual product={suggestion} className="h-16 w-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink-soft">Pairs well with</p>
                <p className="truncate text-sm font-medium">{suggestion.shortName} SPF {suggestion.spf}</p>
              </div>
              <button
                type="button"
                onClick={() => add(suggestion.slug, suggestion.shades?.[0].id)}
                className="rounded-full bg-white px-3 py-2 text-xs font-semibold shadow-soft hover:bg-ink hover:text-cream"
              >
                + {formatPrice(suggestion.price)}
              </button>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 bg-white/60 px-6 py-5">
            <div className="flex items-center justify-between text-base">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">Shipping and taxes calculated at checkout.</p>
            <button
              type="button"
              className="btn-primary mt-4 w-full"
              onClick={() => {
                close()
                navigate('/checkout')
              }}
            >
              Checkout · {formatPrice(subtotal)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
