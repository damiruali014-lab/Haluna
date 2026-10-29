import type { ReactNode } from 'react'
import type { Shade } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import { MinusIcon, PlusIcon } from './Icons'

export function Stars({ rating, size = 14, className = '' }: { rating: number; size?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))
  const row = (
    <svg width={size * 5 + 8} height={size} viewBox="0 0 108 20" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${i * 22} 0)`}
          d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.8L10 1.5Z"
        />
      ))}
    </svg>
  )
  return (
    <span className={`relative inline-flex ${className}`} role="img" aria-label={`Rated ${rating} out of 5`}>
      <span className="text-ink/15 [&_path]:fill-current">{row}</span>
      <span className="absolute inset-0 overflow-hidden text-sun [&_path]:fill-current" style={{ width: `${pct}%` }}>
        {row}
      </span>
    </span>
  )
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'section' | 'li' }) {
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
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full transition hover:bg-sand-soft disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon size={16} />
      </button>
      <span className={`min-w-7 text-center font-medium tabular-nums ${size === 'sm' ? 'text-sm' : ''}`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full transition hover:bg-sand-soft disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  )
}

export function ShadeChips({
  shades,
  value,
  onChange,
  name,
  compact,
}: {
  shades: Shade[]
  value: string
  onChange: (id: string) => void
  name: string
  compact?: boolean
}) {
  return (
    <fieldset>
      <legend className={compact ? 'sr-only' : 'mb-2.5 text-sm font-medium'}>
        Shade: <span className="text-ink-soft">{shades.find((s) => s.id === value)?.name}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {shades.map((s) => (
          <label
            key={s.id}
            className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white transition has-[:checked]:border-ink has-[:checked]:shadow-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun-deep ${
              compact ? 'py-1 pr-3 pl-1 text-xs' : 'py-1.5 pr-4 pl-1.5 text-sm'
            } border-ink/15 hover:border-ink/40`}
          >
            <input
              type="radio"
              name={name}
              value={s.id}
              checked={value === s.id}
              onChange={() => onChange(s.id)}
              className="sr-only"
            />
            <span
              className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} rounded-full ring-1 ring-ink/10 ring-inset`}
              style={{ background: s.swatch }}
              aria-hidden="true"
            />
            {s.name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function SectionHeading({ eyebrow, title, intro, align = 'center' }: { eyebrow: string; title: ReactNode; intro?: string; align?: 'center' | 'left' }) {
  return (
    <Reveal className={`mb-10 max-w-2xl sm:mb-14 ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-4xl leading-[1.05] sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{intro}</p>}
    </Reveal>
  )
}
