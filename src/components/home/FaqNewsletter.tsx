import { useId, useState, type FormEvent } from 'react'
import { faqs } from '../../data/content'
import { GooButton } from '../GooButton'
import { CheckIcon, PlusIcon } from '../Icons'
import { Mark } from '../Logo'
import { Reveal } from '../ui'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()
  return (
    <section id="faq" className="py-20 sm:py-28" aria-labelledby="faq-title">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="label text-ink-soft">09 · faq</p>
          <h2 id="faq-title" className="display mt-5 text-display-l">
            Questions, answered.
          </h2>
          <p className="mt-6 max-w-sm text-ink-soft">Still wondering? Write to hello@haluna.example and a real person answers within a day.</p>
        </Reveal>
        <Reveal delay={100} className="border-t border-ink/15">
          {faqs.map((f, i) => {
            const isOpen = open === i
            const btnId = `${baseId}-q${i}`
            const panelId = `${baseId}-a${i}`
            return (
              <div key={f.q} className="border-b border-ink/15">
                <h3 className="font-sans [font-stretch:100%]">
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold"
                  >
                    {f.q}
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition duration-[var(--dur-base)] ease-[var(--ease-cream)] ${isOpen ? 'rotate-45 bg-ink text-bone' : 'border border-ink/20'}`}>
                      <PlusIcon size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-[var(--dur-base)] ease-[var(--ease-out)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pr-12 pb-7 leading-relaxed text-ink-soft">{f.a}</p>
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
    <section className="pb-20 sm:pb-28" aria-labelledby="newsletter-title">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-panel bg-blush px-6 py-14 sm:px-14 sm:py-20">
          <Mark className="absolute -right-10 -bottom-16 -z-10 h-[340px] w-[340px] text-ink/[0.07] sm:h-[460px] sm:w-[460px]" title="" />
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div>
              <p className="label">the haluna list</p>
              <h2 id="newsletter-title" className="display mt-5 text-display-l">
                Get 10% off your first order.
              </h2>
              <p className="mt-5 max-w-md text-ink/80">Sun-smart notes, early access to new shades, and a little welcome gift.</p>
            </div>
            <div>
              {done ? (
                <p role="status" className="inline-flex animate-fade-in items-center gap-3 rounded-full bg-bone px-6 py-4 font-semibold">
                  <CheckIcon size={18} />
                  You're in. Use <strong className="tracking-widest">SUNNY10</strong> at checkout.
                </p>
              ) : (
                <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
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
                    className="input !rounded-full !border-ink/15 !px-6 !py-4"
                  />
                  <GooButton type="submit" className="shrink-0">
                    Subscribe
                  </GooButton>
                </form>
              )}
              {error && (
                <p id="newsletter-error" className="mt-3 text-sm font-semibold" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
