import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPrice } from '../data/products'
import { useCart, type ResolvedLine } from '../lib/cart'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ProductImage } from '../components/ProductImage'
import { FreeShippingBar } from '../components/CartDrawer'
import { ArrowLeftIcon, CheckIcon, InfoIcon, LockIcon } from '../components/Icons'

interface Order {
  number: string
  email: string
  firstName: string
  lines: ResolvedLine[]
  subtotal: number
  shipping: number
  total: number
}

const FIELDS = ['email', 'firstName', 'lastName', 'address', 'city', 'zip', 'country'] as const
type Field = (typeof FIELDS)[number]

export default function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  useDocumentMeta(order ? 'Order confirmed' : 'Checkout', 'Demo checkout for the Haluna concept store. No real payment is processed.')

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (f: Field) => String(data.get(f) ?? '').trim()
    const next: Partial<Record<Field, string>> = {}
    for (const f of FIELDS) if (!get(f)) next[f] = 'This field is required.'
    if (get('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email'))) next.email = 'Enter a valid email address.'
    setErrors(next)
    const firstInvalid = FIELDS.find((f) => next[f])
    if (firstInvalid) {
      document.getElementById(`co-${firstInvalid}`)?.focus()
      return
    }
    setSubmitting(true)
    // Simulated processing delay. Nothing is sent anywhere.
    window.setTimeout(() => {
      setOrder({
        number: `HL-${Math.floor(100000 + Math.random() * 900000)}`,
        email: get('email'),
        firstName: get('firstName'),
        lines,
        subtotal,
        shipping,
        total,
      })
      clear()
      window.scrollTo({ top: 0 })
    }, 900)
  }

  if (order) return <Confirmation order={order} />

  if (lines.length === 0) {
    return (
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="display text-display-l">Your bag is empty</h1>
        <p className="mt-4 text-ink-soft">Add a sunscreen or two, then come back to check out.</p>
        <Link to="/#shop" className="btn-ink mt-8">
          Shop sunscreens
        </Link>
      </section>
    )
  }

  return (
    <div className="container-page pt-6 pb-24 sm:pt-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
        <ArrowLeftIcon size={16} /> Continue shopping
      </Link>
      <h1 className="display mt-4 text-display-l">Checkout</h1>

      <div role="note" className="mt-8 flex items-start gap-3 rounded-card bg-blush px-5 py-4 text-sm text-ink">
        <InfoIcon size={20} className="mt-0.5 shrink-0" />
        <p>
          <strong className="font-semibold">Demo store: no real payment is processed.</strong> Haluna is a fictional brand.
          Please don't enter real card details; the payment fields are disabled.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14">
        <form
          onSubmit={submit}
          onChange={(e) => {
            const name = (e.target as unknown as HTMLInputElement).name as Field
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
          }}
          noValidate
          className="min-w-0 space-y-10"
          aria-label="Checkout"
        >
          <Section title="Contact">
            <Input id="email" label="Email" type="email" autoComplete="email" error={errors.email} />
          </Section>

          <Section title="Shipping address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="firstName" label="First name" autoComplete="given-name" error={errors.firstName} />
              <Input id="lastName" label="Last name" autoComplete="family-name" error={errors.lastName} />
            </div>
            <Input id="address" label="Address" autoComplete="street-address" error={errors.address} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input id="city" label="City" autoComplete="address-level2" error={errors.city} />
              <Input id="zip" label="ZIP / Postcode" autoComplete="postal-code" error={errors.zip} />
              <div>
                <label htmlFor="co-country" className="mb-1.5 block text-sm font-medium">
                  Country
                </label>
                <select id="co-country" name="country" autoComplete="country-name" className="input appearance-none" defaultValue="United States">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>
          </Section>

          <Section
            title="Payment"
            aside={
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <LockIcon size={14} /> Demo only
              </span>
            }
          >
            {/* Stripe-style card element, intentionally disabled: this demo never collects card data. */}
            <div aria-disabled="true" className="rounded-2xl border border-dashed border-ink/20 bg-sand/60 p-4 sm:p-5">
              <p className="mb-4 text-sm text-ink-soft" id="payment-note">
                Card payments are disabled in this demo. In a real store, a secure Stripe or Shopify payment form goes here.
              </p>
              <fieldset disabled aria-describedby="payment-note" className="space-y-3 opacity-60">
                <legend className="sr-only">Card details (disabled)</legend>
                <div>
                  <label htmlFor="co-card" className="mb-1.5 block text-sm font-medium">
                    Card number
                  </label>
                  <input id="co-card" disabled className="input cursor-not-allowed" placeholder="1234 1234 1234 1234" autoComplete="off" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="co-exp" className="mb-1.5 block text-sm font-medium">
                      Expiry
                    </label>
                    <input id="co-exp" disabled className="input cursor-not-allowed" placeholder="MM / YY" autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor="co-cvc" className="mb-1.5 block text-sm font-medium">
                      CVC
                    </label>
                    <input id="co-cvc" disabled className="input cursor-not-allowed" placeholder="CVC" autoComplete="off" />
                  </div>
                </div>
              </fieldset>
            </div>
          </Section>

          <button type="submit" className="btn-ink w-full !py-4 text-base" disabled={submitting}>
            {submitting ? 'Placing order…' : `Place demo order · ${formatPrice(total)}`}
          </button>
        </form>

        <OrderSummary lines={lines} subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  )
}

function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="display text-[2rem] leading-none">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

function Input({ id, label, error, type = 'text', autoComplete }: { id: Field; label: string; error?: string; type?: string; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={`co-${id}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={`co-${id}`}
        name={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `co-${id}-error` : undefined}
        className={`input ${error ? '!border-rosewood' : ''}`}
      />
      {error && (
        <p id={`co-${id}-error`} className="mt-1.5 text-sm text-rosewood">
          {error}
        </p>
      )}
    </div>
  )
}

function OrderSummary({ lines, subtotal, shipping, total }: { lines: ResolvedLine[]; subtotal: number; shipping: number; total: number }) {
  return (
    <aside aria-label="Order summary" className="h-fit rounded-panel bg-sand p-6 shadow-soft lg:sticky lg:top-28">
      <h2 className="display text-[2rem] leading-none">Order summary</h2>
      <ul className="mt-5 divide-y divide-ink/10">
        {lines.map((l) => (
          <li key={l.key} className="flex items-center gap-4 py-3">
            <div className="relative shrink-0">
              <div className="h-16 w-16 overflow-hidden rounded-sm bg-sand"><ProductImage product={l.product} shade={l.shade} sizes="64px" /></div>
              <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-semibold text-bone">
                {l.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{l.product.name}</p>
              <p className="text-xs text-ink-soft">
                {l.product.size}
                {l.shade && ` · ${l.shade.name}`}
              </p>
            </div>
            <p className="text-sm font-medium tabular-nums">{formatPrice(l.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Shipping</dt>
          <dd className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      {shipping > 0 && (
        <div className="mt-5">
          <FreeShippingBar subtotal={subtotal} />
        </div>
      )}
    </aside>
  )
}

function Confirmation({ order }: { order: Order }) {
  return (
    <section className="container-page max-w-2xl py-16 text-center sm:py-24" aria-labelledby="confirm-title">
      <div className="mx-auto grid h-16 w-16 animate-fade-in place-items-center rounded-full bg-blush text-ink">
        <CheckIcon size={30} />
      </div>
      <p className="label mt-6 text-ink-soft">Order {order.number}</p>
      <h1 id="confirm-title" className="display mt-3 text-display-l">
        Thank you, {order.firstName}!
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft">
        Your demo order is confirmed. In a real store, a receipt would be on its way to <strong className="text-ink">{order.email}</strong>.
      </p>

      <div className="mt-10 rounded-panel bg-sand p-6 text-left shadow-soft">
        <ul className="divide-y divide-ink/10">
          {order.lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {l.quantity} × {l.product.name}
                {l.shade && <span className="text-ink-soft"> ({l.shade.name})</span>}
              </span>
              <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-semibold">
          <span>Total {order.shipping === 0 ? '(free shipping)' : `(incl. ${formatPrice(order.shipping)} shipping)`}</span>
          <span className="tabular-nums">{formatPrice(order.total)}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-soft">This is a demo store. No payment was taken and nothing will ship.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-ink">
          Back to the shop
        </Link>
        <a href="https://damiruali014-lab.github.io" target="_blank" rel="noopener" className="btn-line">
          Want a store like this?
        </a>
      </div>
    </section>
  )
}
