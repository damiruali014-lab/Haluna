import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { setScroller } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Smooth scroll for wheel/trackpad. Touch keeps native scrolling. */
export function startSmoothScroll() {
  if (lenis) return
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  // Web fonts and lazy images change section heights; re-measure trigger positions once they settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  setScroller({
    scrollTo: (target, opts) => lenis?.scrollTo(target, { offset: opts?.offset ?? 0, immediate: opts?.immediate }),
  })
}

export { gsap, ScrollTrigger }
export { heroPour } from './heroPour'
export { blushBloom, textureReveal } from './scenes'
