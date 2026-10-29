import { useId, useRef, useState, type FormEvent } from 'react'
import { products } from '../../data/products'
import { faqs, ingredients, reviews } from '../../data/content'
import { site } from '../../data/site'
import { ProductCard } from '../ProductCard'
import { CastIcon, CheckIcon, ChevronDownIcon, FeatherIcon, LeafIcon, PlayIcon, WaveIcon } from '../Icons'
import { Reveal, SectionHeading, Stars } from '../ui'

const BENEFITS = [
  { Icon: CastIcon, title: 'No white cast', text: 'Clear on every skin tone' },
  { Icon: WaveIcon, title: 'Reef-friendly', text: 'No oxybenzone or octinoxate' },
  { Icon: FeatherIcon, title: 'Lightweight', text: 'Water-light, never greasy' },
  { Icon: LeafIcon, title: 'Fragrance-free', text: 'Gentle on sensitive skin' },
]

export function BenefitsStrip() {
  return (
    <section aria-label="Benefits" className="border-y border-ink/10 bg-white/50">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
        {BENEFITS.map(({ Icon, title, text }, i) => (
          <Reveal as="li" key={title} delay={i * 80} className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sun-soft text-sun-deep">
              <Icon size={24} />
            </span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="block text-sm text-ink-soft">{text}</span>
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export function ShopSection() {
  return (
    <section id="shop" className="py-20 sm:py-28" aria-labelledby="shop-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="The collection"
          title={<span id="shop-title">Three formulas. Zero compromise.</span>}
          intro="Everything you need for face and body, from your morning commute to a long day at the beach."
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 100} className={i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:w-auto' : ''}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function IngredientsSection() {
  return (
    <section id="ingredients" className="grain relative isolate overflow-clip bg-sage-soft py-20 sm:py-28" aria-labelledby="ingredients-title">
      <div aria-hidden="true" className="absolute top-1/2 -left-40 -z-10 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0%,rgba(255,255,255,0)_70%)]" />
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="What's inside"
            title={<span id="ingredients-title">Short ingredient lists. Serious skin science.</span>}
            intro="Every Haluna formula is built on gentle mineral protection, then layered with skincare actives your face will thank you for."
          />
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ingredients.map((ing, i) => (
            <Reveal as="li" key={ing.name} delay={i * 80} className="card p-6 sm:p-7">
              <p className="text-xs font-semibold tracking-[0.14em] text-sage-deep uppercase">{ing.role}</p>
              <h3 className="mt-3 text-2xl">{ing.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{ing.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ReviewsSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  const play = () => {
    const v = videoRef.current
    if (!v) return
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setFailed(true))
  }

  return (
    <section id="reviews" className="py-20 sm:py-28" aria-labelledby="reviews-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="Reviews"
          title={<span id="reviews-title">Loved by 2,000+ sun-seekers</span>}
          intro="Real routines, real skin. Here's what people say after a summer with Haluna."
        />
        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-12">
          <Reveal className="mx-auto w-full max-w-[360px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-panel bg-ink shadow-lift">
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
                aria-label="Customer video review of Haluna Daily Fluid"
              />
              {!playing && (
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-cream">
                  {!site.ugc.poster && (
                    <div aria-hidden="true" className="absolute inset-0 -z-0 bg-[radial-gradient(80%_60%_at_50%_30%,#F7B27F_0%,#C2683A_45%,#2B1E16_100%)]">
                      <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
                        <circle cx="45" cy="70" r="20" fill="#FBD9BE" opacity=".55" />
                        <path d="M0 96c10-3 20-3 30 0s20 3 30 0 20-3 30 0v64H0Z" fill="#2B1E16" opacity=".22" />
                        <path d="M0 108c10-3 20-3 30 0s20 3 30 0 20-3 30 0v52H0Z" fill="#2B1E16" opacity=".25" />
                      </svg>
                    </div>
                  )}
                  <div className="relative flex items-center gap-2 text-xs font-medium">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-cream font-display text-sm text-ink">M</span>
                    @maya.outdoors
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={play}
                      className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-cream/95 text-ink shadow-lift transition hover:scale-105"
                      aria-label="Play customer video review"
                    >
                      <PlayIcon size={26} />
                    </button>
                    <p className="font-display text-xl leading-snug">"Zero white cast on my deep skin. I'm obsessed."</p>
                    {failed && (
                      <p className="mt-3 rounded-lg bg-ink/60 px-3 py-2 text-xs" role="status">
                        Video coming soon: add /videos/haluna-ugc.mp4 to play it here.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal className="mb-6 flex flex-wrap items-center gap-4 rounded-panel bg-sand-soft p-5 sm:p-6">
              <p className="font-display text-5xl leading-none">4.8</p>
              <div>
                <Stars rating={4.8} size={18} />
                <p className="mt-1 text-sm text-ink-soft">Average from 2,693 verified reviews</p>
              </div>
            </Reveal>
            <ul className="grid grid-cols-1 gap-4">
              {reviews.map((r, i) => (
                <Reveal as="li" key={r.name} delay={i * 80} className="card p-6">
                  <figure>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars rating={r.rating} />
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-sage-deep">
                        <CheckIcon size={14} /> Verified buyer
                      </span>
                    </div>
                    <blockquote className="mt-3">
                      <p className="font-display text-xl">{r.title}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{r.text}</p>
                    </blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-semibold">{r.name}</span>
                      <span className="text-ink-soft"> · {r.product}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()
  return (
    <section id="faq" className="bg-white/60 py-20 sm:py-28" aria-labelledby="faq-title">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="FAQ" title={<span id="faq-title">Questions, answered</span>} />
        <Reveal className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f, i) => {
            const isOpen = open === i
            const btnId = `${baseId}-q${i}`
            const panelId = `${baseId}-a${i}`
            return (
              <div key={f.q}>
                <h3 className="font-sans text-base sm:text-lg">
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-medium"
                  >
                    {f.q}
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition duration-300 ${isOpen ? 'rotate-180 bg-ink text-cream' : ''}`}
                    >
                      <ChevronDownIcon size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="pr-12 pb-6 leading-relaxed text-ink-soft">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setDone(true)
  }

  return (
    <section className="py-20 sm:py-24" aria-labelledby="newsletter-title">
      <div className="container-page">
        <Reveal className="grain relative isolate overflow-clip rounded-[2rem] bg-sun px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FBD9BE] opacity-70 blur-3xl" />
          <p className="text-xs font-semibold tracking-[0.18em] text-ink uppercase">Join the Haluna list</p>
          <h2 id="newsletter-title" className="mx-auto mt-3 max-w-xl text-4xl leading-tight sm:text-5xl">
            Get 10% off your first order
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink/80">Sun-smart tips, early access to new drops and a little welcome gift.</p>

          {done ? (
            <p role="status" className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-4 font-medium">
              <CheckIcon size={18} className="text-sage-deep" />
              You're in! Use code <strong className="tracking-wider">SUNNY10</strong> at checkout.
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="input !rounded-full !border-transparent !px-5 !py-3.5"
              />
              <button type="submit" className="btn-dark shrink-0">
                Subscribe
              </button>
            </form>
          )}
          {error && (
            <p id="newsletter-error" className="mt-3 text-sm font-medium text-ink" role="alert">
              {error}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
