import { loadMotion } from '../../motion/load'
import { Img } from '../Img'
import { useNearViewport } from '../ui'

const WORDS = ['Lightweight.', 'Invisible.', 'Yours.']

/** Full-bleed macro of the cream with a sticky, scroll-revealed line. */
export function TextureSection() {
  const ref = useNearViewport((el) => {
    let cleanup: (() => void) | undefined
    let dead = false
    loadMotion().then((m) => {
      if (m && !dead) cleanup = m.textureReveal(el)
    })
    return () => {
      dead = true
      cleanup?.()
    }
  })

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative h-[240vh] max-lg:h-[200vh]" aria-labelledby="texture-title">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-texture-img className="absolute inset-0 will-change-transform">
          <Img src="/images/texture-cream.webp" alt="Macro of a swirl of white sunscreen cream with a streak of blush" sizes="100vw" className="h-full w-full object-cover object-[70%_50%]" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-bone/85 via-bone/30 to-transparent" />
        <div className="container-page relative flex h-full flex-col justify-end pb-[12vh]">
          <p className="label text-ink">04 · the texture</p>
          <h2 id="texture-title" className="display mt-5 text-display-xl leading-[0.86]">
            {WORDS.map((w) => (
              <span key={w} data-word className="block">
                {w}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-sm text-body-l text-ink">A serum-light fluid that melts in within seconds and leaves nothing behind but a soft, skin-like finish.</p>
        </div>
      </div>
    </section>
  )
}
