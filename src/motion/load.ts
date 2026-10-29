import { prefersReducedMotion } from '../lib/scroll'

type Engine = typeof import('./engine')
let pending: Promise<Engine> | null = null

/** Resolves once the page has loaded and the main thread is idle, so motion never delays first render. */
function afterLoadIdle() {
  return new Promise<void>((resolve) => {
    const idle = () => ('requestIdleCallback' in window ? window.requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 200))
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
  })
}

/**
 * Lazily loads GSAP + ScrollTrigger + Lenis (a separate chunk, fetched after load + idle).
 * Resolves to null when the user prefers reduced motion.
 */
export function loadMotion(): Promise<Engine | null> {
  if (prefersReducedMotion()) return Promise.resolve(null)
  pending ??= afterLoadIdle().then(() => import('./engine'))
  return pending
}
