import { useEffect, useRef, type ReactNode } from 'react'
import type { Shade } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import { MinusIcon, PlusIcon } from './Icons'

export function Stars({ rating, size = 13, className = '', tone = 'ink' }: { rating: number; size?: number; className?: string; tone?: 'ink' | 'bone' }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))
  const row = (
    <svg width={size * 5 + 8} height={size} viewBox="0 0 108 20" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} transform={`translate(${i * 22} 0)`} d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.8L10 1.5Z" />
      ))}
    </svg>
  )
  const on = tone === 'bone' ? 'text-bone' : 'text-ink'
  return (
    <span className={`relative inline-flex ${className}`} role="img" aria-label={`Rated ${rating} out of 5`}>
      <span className={`${on} opacity-20 [&_path]:fill-current`}>{row}</span>
      <span className={`absolute inset-0 overflow-hidden ${on} [&_path]:fill-current`} style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  )
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li'
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <Tag ref={ref as never} className={className} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
  size = 'md',
}: {
  value: number
  onChange: (v: number) => void
  label: string
  min?: number
  max?: number
  size?: 'sm' | 'md'
}) {
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-12 w-12'
  return (
    <div className="inline-flex items-center rounded-full border border-ink/20" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon size={15} />
      </button>
      <span className={`min-w-7 text-center font-semibold tabular-nums ${size === 'sm' ? 'text-sm' : ''}`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full transition hover:bg-ink/5 disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon size={15} />
      </button>
    </div>
  )
}

/** Shade chips: round swatches with the name, as radio buttons. */
export function ShadeChips({
  shades,
  value,
  onChange,
  name,
  compact,
  tone = 'ink',
}: {
  shades: Shade[]
  value: string
  onChange: (id: string) => void
  name: string
  compact?: boolean
  tone?: 'ink' | 'bone'
}) {
  const current = shades.find((s) => s.id === value)
  const ring = tone === 'bone' ? 'has-[:checked]:border-bone border-bone/25 hover:border-bone/60' : 'has-[:checked]:border-ink border-ink/15 hover:border-ink/50'
  return (
    <fieldset>
      <legend className={compact ? 'sr-only' : 'label mb-3'}>
        Shade <span className="sr-only">: {current?.name}</span>
        {!compact && <span className="ml-2 normal-case tracking-normal opacity-80">{current?.name}</span>}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {shades.map((s) => (
          <label
            key={s.id}
            title={s.name}
            className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full border transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-current ${ring} ${
              compact ? 'p-1' : 'py-1 pr-4 pl-1 text-sm'
            }`}
          >
            <input type="radio" name={name} value={s.id} checked={value === s.id} onChange={() => onChange(s.id)} className="sr-only" />
            <span className={`${compact ? 'h-5 w-5' : 'h-7 w-7'} rounded-full ring-1 ring-black/10 ring-inset`} style={{ background: s.swatch }} aria-hidden="true" />
            {compact ? <span className="sr-only">{s.name}</span> : s.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function SectionIntro({
  index,
  eyebrow,
  title,
  intro,
  className = '',
  id,
}: {
  index?: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  className?: string
  id?: string
}) {
  return (
    <Reveal className={className}>
      <p className="label flex items-center gap-3 opacity-80">
        {index && <span className="tabular-nums">{index}</span>}
        {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />}
        {eyebrow}
      </p>
      <h2 id={id} className="display mt-5 text-display-l">
        {title}
      </h2>
      {intro && <p className="mt-6 max-w-md text-body-l opacity-80">{intro}</p>}
    </Reveal>
  )
}

/** Runs a callback once the element is near the viewport (used to lazy-start GSAP scenes). */
export function useNearViewport(cb: (el: HTMLElement) => void | (() => void), rootMargin = '200px') {
  const ref = useRef<HTMLElement | null>(null)
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cleanup: void | (() => void)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          cleanup = cbRef.current(el)
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (typeof cleanup === 'function') cleanup()
    }
  }, [rootMargin])
  return ref
}
