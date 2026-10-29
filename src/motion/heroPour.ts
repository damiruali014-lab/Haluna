import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CREAM_RADIUS, NOZZLE, PILL, STAGE, initialState, type PourState } from '../components/home/heroGeometry'
import { bakeCream, pillTargets } from './creamSim'
import { createCreamRenderer } from './creamRenderer'

type RenderRig = (root: HTMLElement, s: PourState) => void

const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * Signature animation 1: the cream pour.
 * The flip-top opens, the tube is squeezed, and a baked rope-of-cream simulation (creamSim) is
 * scrubbed frame by frame and drawn as lit cream (creamRenderer). The cap closes, the dollop
 * smooths into a pill and hands over to the real "Shop the collection" button.
 *
 * Desktop: the stage is CSS-sticky and the whole sequence is scrubbed by scroll (reversible).
 * Mobile/tablet: no scroll-jacking; the sequence plays once when the stage comes into view.
 */
export function heroPour(section: HTMLElement, stage: HTMLElement, renderRig: RenderRig) {
  const canvas = stage.querySelector<HTMLCanvasElement>('canvas[data-cream]')!
  const renderer = createCreamRenderer(canvas, STAGE, CREAM_RADIUS)
  const sim = bakeCream({ nozzle: NOZZLE, floorY: STAGE.floorY, radius: CREAM_RADIUS })
  const last = sim.frames - 1
  const nLast = sim.count[last]
  const base = last * sim.maxParticles * 3
  const settled = sim.pos.slice(base, base + nLast * 3)
  const pill = pillTargets(settled, nLast, NOZZLE.x, STAGE.floorY, PILL.w, PILL.h, CREAM_RADIUS * 0.55)
  const buf = new Float32Array(sim.maxParticles * 3)
  const s = initialState()

  const draw = () => {
    renderRig(stage, s)
    if (!renderer) return
    if (s.sim <= 0.0005) return renderer.draw(buf, 0)
    if (s.pill > 0) {
      const k = smooth(Math.min(1, s.pill))
      for (let i = 0; i < nLast * 3; i++) buf[i] = settled[i] + (pill[i] - settled[i]) * k
      return renderer.draw(buf, nLast, 1 - smooth(Math.max(0, (s.pill - 0.94) / 0.06)))
    }
    const f = Math.min(last, Math.round(s.sim * last))
    const n = sim.count[f]
    buf.set(sim.pos.subarray(f * sim.maxParticles * 3, f * sim.maxParticles * 3 + n * 3))
    renderer.draw(buf, n)
  }

  const build = () => {
    const tl = gsap
      .timeline({ defaults: { ease: 'none' }, onUpdate: draw })
      .to(s, { lift: 1, ease: 'power2.out', duration: 0.1 }, 0)
      .to(s, { lid: 1, ease: 'back.out(1.3)', duration: 0.16 }, 0.07)
      .to(s, { squeeze: 0.94, ease: 'sine.inOut', duration: 0.3 }, 0.25)
      .to(s, { sim: 1, duration: 0.56 }, 0.25)
      .to(s, { squeeze: 1, ease: 'sine.out', duration: 0.14 }, 0.6)
      .to(s, { lid: 0, ease: 'power3.in', duration: 0.08 }, 0.79)
      .to(s, { pill: 1, ease: 'power1.inOut', duration: 0.13 }, 0.85)
    // Dev-only handle for inspecting single frames: __hlPour.progress(0.5)
    if (import.meta.env.DEV) (window as unknown as { __hlPour: gsap.core.Timeline }).__hlPour = tl
    return tl
  }

  const mm = gsap.matchMedia()
  mm.add('(min-width: 1024px)', () => {
    const tl = build()
    ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6, animation: tl })
  })
  mm.add('(max-width: 1023.98px)', () => {
    const tl = build().pause()
    tl.duration(5.2)
    ScrollTrigger.create({ trigger: stage, start: 'top 70%', once: true, onEnter: () => tl.play() })
  })

  const onResize = () => {
    renderer?.resize()
    draw()
  }
  window.addEventListener('resize', onResize)
  draw()

  return () => {
    window.removeEventListener('resize', onResize)
    mm.revert()
    renderer?.destroy()
  }
}
