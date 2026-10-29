import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Signature animation 3: blush clouds bloom and drift behind the colour line, scrubbed by scroll. */
export function blushBloom(section: HTMLElement) {
  const clouds = section.querySelectorAll<HTMLElement>('[data-bloom]')
  const ctx = gsap.context(() => {
    clouds.forEach((c, i) => {
      gsap.fromTo(
        c,
        { scale: 0.35, opacity: 0, xPercent: i % 2 ? 12 : -12, yPercent: 10 },
        {
          scale: 1.15,
          opacity: 1,
          xPercent: i % 2 ? -8 : 10,
          yPercent: -6 - i * 4,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 85%', end: 'bottom 30%', scrub: 1.2 },
        },
      )
    })
  }, section)
  return () => ctx.revert()
}

/** Texture section: words light up one by one while the line is pinned over the macro shot. */
export function textureReveal(section: HTMLElement) {
  const words = section.querySelectorAll<HTMLElement>('[data-word]')
  const img = section.querySelector<HTMLElement>('[data-texture-img]')
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
    })
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', duration: words.length }, 0)
    words.forEach((w, i) => {
      tl.fromTo(w, { opacity: 0.12, filter: 'blur(6px)', y: 18 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.7, ease: 'power2.out' }, i * 0.9)
    })
  }, section)
  ScrollTrigger.refresh()
  return () => ctx.revert()
}
