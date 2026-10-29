/** Scroll helpers that cooperate with Lenis smooth scrolling when it is active. */
type Scroller = { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; immediate?: boolean }) => void }

let scroller: Scroller | null = null

export function setScroller(s: Scroller | null) {
  scroller = s
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToElement(el: HTMLElement) {
  if (scroller) scroller.scrollTo(el, { offset: -80 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToTop() {
  if (scroller) scroller.scrollTo(0, { immediate: true })
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
}
