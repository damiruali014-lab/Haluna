import { useRef } from 'react'
import { ingredients } from '../../data/content'
import { Img } from '../Img'
import { ArrowLeftIcon, ArrowRightIcon } from '../Icons'
import { Reveal } from '../ui'

/** Horizontally scrolling macro cards (scroll-snap, arrow buttons, keyboard-scrollable). */
export function Ingredients() {
  const track = useRef<HTMLUListElement>(null)
  const page = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: 'smooth' })
  }

  return (
    <section id="ingredients" className="overflow-clip bg-sand py-20 sm:py-28" aria-labelledby="ingredients-title">
      <div className="container-page flex flex-wrap items-end justify-between gap-8">
        <Reveal>
          <p className="label text-ink-soft">07 · what's inside</p>
          <h2 id="ingredients-title" className="display mt-5 max-w-2xl text-display-l">
            Short lists. Serious skin science.
          </h2>
        </Reveal>
        <div className="flex gap-2">
          <button type="button" onClick={() => page(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 transition hover:bg-ink hover:text-bone" aria-label="Previous ingredients" aria-controls="ingredient-track">
            <ArrowLeftIcon size={18} />
          </button>
          <button type="button" onClick={() => page(1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 transition hover:bg-ink hover:text-bone" aria-label="Next ingredients" aria-controls="ingredient-track">
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>

      <ul
        id="ingredient-track"
        ref={track}
        tabIndex={0}
        aria-label="Key ingredients (scrollable)"
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:px-8 xl:px-[max(3rem,calc((100vw-1480px)/2+3rem))] [&::-webkit-scrollbar]:hidden"
      >
        {ingredients.map((ing, i) => (
          <li key={ing.name} className="w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[44vw]">
            <article className="group flex h-full flex-col overflow-hidden rounded-card bg-bone">
              <div className="relative aspect-[4/3.6] overflow-hidden">
                <Img
                  src={ing.image}
                  alt=""
                  sizes="(min-width: 640px) 800px, 480px"
                  className="h-full w-full scale-[var(--z)] object-cover transition-[scale] duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[calc(var(--z)*1.08)]"
                  style={{ objectPosition: ing.focus, transformOrigin: 'origin' in ing ? ing.origin : ing.focus, ['--z' as string]: ing.zoom }}
                />
                <span className="display absolute top-4 left-5 text-[3.2rem] leading-none text-ink/80 tabular-nums">0{i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="label text-ink-soft">{ing.role}</p>
                <h3 className="display mt-3 text-[2rem] leading-none">{ing.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{ing.text}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
