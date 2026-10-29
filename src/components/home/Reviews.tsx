import { useRef, useState } from 'react'
import { reviews } from '../../data/content'
import { site } from '../../data/site'
import { CheckIcon, PlayIcon } from '../Icons'
import { Reveal, Stars } from '../ui'

function UGCPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const play = () => {
    videoRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setFailed(true))
  }
  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-arch bg-dusk text-bone shadow-lift">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={site.ugc.video}
        poster={site.ugc.poster}
        preload="none"
        playsInline
        controls={playing}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
        aria-label="Customer video review of Haluna Daily Mineral Sunscreen"
      />
      {!playing && (
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {!site.ugc.poster && (
            <div aria-hidden="true" className="absolute inset-0">
              <img src="/images/r/lifestyle-1-480.webp" alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/30 to-transparent" />
            </div>
          )}
          <div className="relative mt-10 flex items-center gap-2 text-xs font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-bone text-ink">M</span>
            @maya.outdoors
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={play}
              className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-bone text-ink shadow-lift transition duration-[var(--dur-base)] ease-[var(--ease-cream)] hover:scale-110"
              aria-label="Play customer video review"
            >
              <PlayIcon size={24} />
            </button>
            <p className="display text-[1.7rem] leading-tight">"Zero white cast on my deep skin. I'm obsessed."</p>
            {failed && (
              <p className="mt-3 rounded-sm bg-ink/60 px-3 py-2 text-xs" role="status">
                Video coming soon: add /videos/haluna-ugc.mp4 to play it here.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function Reviews() {
  return (
    <section id="reviews" className="py-20 sm:py-28" aria-labelledby="reviews-title">
      <div className="container-page grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <p className="label text-ink-soft">08 · reviews</p>
            <h2 id="reviews-title" className="display mt-5 text-display-l">
              4.9 from 2,000+ skins.
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-8 max-w-[340px]">
            <UGCPlayer />
          </Reveal>
        </div>
        <ul className="columns-1 gap-5 sm:columns-2 [&>li]:mb-5 [&>li]:break-inside-avoid">
          {reviews.map((r, i) => {
            const dark = i === 2
            return (
              <Reveal as="li" key={r.name} delay={(i % 2) * 90} className={i === 1 ? 'sm:mt-20' : ''}>
                <figure className={`rounded-card p-7 ${dark ? 'on-dusk bg-dusk text-bone' : i % 3 === 1 ? 'bg-sand' : 'bg-bone ring-1 ring-ink/10'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <Stars rating={r.rating} tone={dark ? 'bone' : 'ink'} />
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${dark ? 'text-dusk-soft' : 'text-ink-soft'}`}>
                      <CheckIcon size={13} /> Verified
                    </span>
                  </div>
                  <blockquote className="mt-5">
                    <p className="display text-[1.65rem] leading-tight">{r.title}</p>
                    <p className={`mt-3 leading-relaxed ${dark ? 'text-dusk-soft' : 'text-ink-soft'}`}>{r.text}</p>
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-semibold">{r.name}</span>
                    <span className={dark ? 'text-dusk-soft' : 'text-ink-soft'}> · {r.product}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
