import { useRef, type ComponentProps, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'ink' | 'cream' | 'bone'

const VARIANTS: Record<Variant, string> = {
  ink: '[--goo-fill:var(--color-ink)] text-bone',
  cream: '[--goo-fill:var(--color-cream)] text-ink',
  bone: '[--goo-fill:var(--color-bone)] text-ink',
}

/**
 * Signature animation 2: a liquid "cream" button. A blob inside the pill follows the pointer and,
 * through the #hl-goo filter, makes the fill bulge toward it. Pressing squishes the pill (see .btn).
 */
function useGoo() {
  const blob = useRef<HTMLSpanElement>(null)
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = blob.current
    if (!el || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(e.clientX - r.left, r.height * 0.45), r.width - r.height * 0.45)
    const dy = (e.clientY - r.top - r.height / 2) * 0.55
    const y = r.height / 2 + Math.max(-r.height * 0.42, Math.min(r.height * 0.42, dy))
    el.style.transform = `translate(-50%, -50%) translate(${x - r.width / 2}px, ${y - r.height / 2}px) scale(1)`
  }
  const leave = () => {
    const el = blob.current
    if (!el) return
    el.style.transform = 'translate(-50%, -50%) scale(0.4)'
  }
  return { blob, handlers: { onPointerMove: move, onPointerEnter: move, onPointerLeave: leave } }
}

function GooInner({ blob, children }: { blob: React.RefObject<HTMLSpanElement | null>; children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="goo-layer pointer-events-none absolute -inset-3">
        <span className="absolute inset-3 rounded-full bg-[var(--goo-fill)]" />
        <span
          ref={blob}
          className="goo-blob absolute top-1/2 left-1/2 h-[1.9em] w-[1.9em] rounded-full bg-[var(--goo-fill)] text-[1.15rem]"
          style={{ transform: 'translate(-50%, -50%) scale(0.4)' }}
        />
      </span>
      <span className="relative">{children}</span>
    </>
  )
}

export function GooButton({
  variant = 'ink',
  className = '',
  children,
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  const { blob, handlers } = useGoo()
  return (
    <button {...props} {...handlers} className={`btn ${VARIANTS[variant]} ${className}`}>
      <GooInner blob={blob}>{children}</GooInner>
    </button>
  )
}

export function GooLink({
  variant = 'ink',
  className = '',
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  const { blob, handlers } = useGoo()
  return (
    <Link {...props} {...handlers} className={`btn ${VARIANTS[variant]} ${className}`}>
      <GooInner blob={blob}>{children}</GooInner>
    </Link>
  )
}

/** Filter shared by every gooey button. Rendered once in the layout. */
export function GooFilterDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <filter id="hl-goo" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </defs>
    </svg>
  )
}
