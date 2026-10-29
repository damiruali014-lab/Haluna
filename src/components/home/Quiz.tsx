import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { formatPrice, getProduct, type Product } from '../../data/products'
import { useCart } from '../../lib/cart'
import { ProductImage } from '../ProductImage'
import { GooButton } from '../GooButton'
import { ArrowLeftIcon, ArrowRightIcon } from '../Icons'
import { Reveal, ShadeChips } from '../ui'

type Answers = { skin?: string; where?: string; finish?: string }

const QUESTIONS: { key: keyof Answers; title: string; options: { value: string; label: string; hint: string }[] }[] = [
  {
    key: 'skin',
    title: 'How does your skin usually feel by 3 pm?',
    options: [
      { value: 'dry', label: 'Tight', hint: 'Dry, thirsty' },
      { value: 'oily', label: 'Shiny', hint: 'Oily or combination' },
      { value: 'sensitive', label: 'Reactive', hint: 'Easily red or sensitive' },
      { value: 'normal', label: 'Fine', hint: 'Balanced, no drama' },
    ],
  },
  {
    key: 'where',
    title: 'Where does your day take you?',
    options: [
      { value: 'daily', label: 'Desk & city', hint: 'Commute, errands, windows' },
      { value: 'go', label: 'On the move', hint: 'Reapplying over makeup' },
      { value: 'beach', label: 'Beach & long days', hint: 'Hours outside, water' },
    ],
  },
  {
    key: 'finish',
    title: 'Clear, or a little colour?',
    options: [
      { value: 'clear', label: 'Clear', hint: 'Invisible, under anything' },
      { value: 'tinted', label: 'Tinted', hint: 'Sheer coverage and glow' },
      { value: 'flush', label: 'Clear + a flush', hint: 'SPF, then colour on cheeks' },
    ],
  },
]

function recommend(a: Required<Answers>): { product: Product; pair?: Product; reason: string } {
  const skin: Record<string, string> = {
    dry: 'Hyaluronic acid keeps tight skin comfortable all day.',
    oily: 'It dries down shine-free, so it lasts on oily skin.',
    sensitive: 'Fragrance-free mineral zinc is the gentlest choice for reactive skin.',
    normal: 'An easy, feel-nothing finish for balanced skin.',
  }
  const p = (slug: string) => getProduct(slug)!
  if (a.where === 'go') return { product: p('sun-stick-spf-50'), pair: p('daily-mineral-sunscreen-spf-50'), reason: `Four swipes over makeup and you are covered again. ${skin[a.skin]}` }
  if (a.finish === 'tinted') return { product: p('glow-tint-spf-30'), pair: p('cheek-balm-blush'), reason: `Sheer coverage that evens tone while it protects. ${skin[a.skin]}` }
  const pair = a.where === 'beach' ? p('after-sun-cooling-gel') : a.finish === 'flush' ? p('cheek-balm-blush') : p('sun-stick-spf-50')
  return { product: p('daily-mineral-sunscreen-spf-50'), pair, reason: `Our lightest SPF 50, invisible under makeup. ${skin[a.skin]}` }
}

export function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [shadeId, setShadeId] = useState('medium')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const touched = useRef(false)
  const viaPointer = useRef(false)
  const { add } = useCart()

  const done = step >= QUESTIONS.length
  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]
  const result = done ? recommend(answers as Required<Answers>) : null

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (touched.current) headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const go = (n: number) => {
    touched.current = true
    setStep(n)
  }
  const choose = (value: string) => {
    setAnswers((a) => ({ ...a, [q.key]: value }))
    // Tapping an answer auto-advances like a story. Keyboard users (arrow keys) stay put and use Next.
    if (viaPointer.current) {
      viaPointer.current = false
      window.setTimeout(() => go(step + 1), 300)
    }
  }

  return (
    <section id="quiz" className="py-20 sm:py-28" aria-labelledby="quiz-title">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <Reveal className="lg:pt-6">
          <p className="label text-ink-soft">06 · sixty-second quiz</p>
          <h2 id="quiz-title" className="display mt-5 text-display-l">
            Find your SPF.
          </h2>
          <p className="mt-6 max-w-sm text-body-l text-ink-soft">Three taps, one match. We'll pair it with the product that finishes the routine.</p>
          <ol className="mt-10 flex items-center gap-3" aria-label="Quiz progress">
            {QUESTIONS.map((_, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold transition duration-[var(--dur-base)] ease-[var(--ease-cream)] ${
                    i < step ? 'scale-90 bg-ink text-bone' : i === step ? 'bg-blush text-ink' : 'border border-ink/20 text-ink-soft'
                  }`}
                >
                  {i + 1}
                  <span className="sr-only">{i < step ? ', answered' : i === step ? ', current' : ''}</span>
                </span>
                {i < QUESTIONS.length - 1 && <span aria-hidden="true" className={`h-px w-8 ${i < step ? 'bg-ink' : 'bg-ink/20'}`} />}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative overflow-hidden rounded-panel bg-sand p-6 sm:p-10">
            {!done ? (
              <form
                key={q.key}
                className="animate-fade-in"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (answers[q.key]) go(step + 1)
                }}
              >
                <fieldset>
                  <legend className="w-full">
                    <span className="label text-ink-soft">
                      question {step + 1} / {QUESTIONS.length}
                    </span>
                    <h3 ref={headingRef} tabIndex={-1} className="display mt-3 text-display-m outline-none">
                      {q.title}
                    </h3>
                  </legend>
                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {q.options.map((o, i) => (
                      <label
                        key={o.value}
                        onPointerDown={() => (viaPointer.current = true)}
                        className="group/opt relative flex min-h-24 cursor-pointer flex-col justify-between rounded-card bg-bone p-5 ring-1 ring-ink/0 transition duration-[var(--dur-base)] ease-[var(--ease-cream)] hover:-translate-y-0.5 hover:ring-ink/30 has-[:checked]:bg-ink has-[:checked]:text-bone has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
                      >
                        <input
                          type="radio"
                          name={q.key}
                          value={o.value}
                          checked={answers[q.key] === o.value}
                          onChange={() => choose(o.value)}
                          className="sr-only"
                        />
                        <span className="label opacity-60">{String.fromCharCode(65 + i)}</span>
                        <span>
                          <span className="block text-lg font-semibold">{o.label}</span>
                          <span className="block text-sm opacity-70">{o.hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold hover:bg-ink/5 ${step === 0 ? 'invisible' : ''}`}
                  >
                    <ArrowLeftIcon size={16} /> Back
                  </button>
                  <button type="submit" className="btn-line" disabled={!answers[q.key]}>
                    {step === QUESTIONS.length - 1 ? 'See my match' : 'Next'} <ArrowRightIcon size={16} />
                  </button>
                </div>
              </form>
            ) : (
              result && (
                <div className="grid animate-fade-in grid-cols-1 gap-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-arch bg-sand">
                    <ProductImage product={result.product} shade={result.product.shades?.find((s) => s.id === shadeId)} sizes="(min-width: 640px) 30vw, 90vw" />
                  </div>
                  <div className="flex flex-col">
                    <p className="label text-ink-soft">your match</p>
                    <h3 ref={headingRef} tabIndex={-1} className="display mt-3 text-display-m outline-none">
                      {result.product.name}
                    </h3>
                    <p className="mt-4 text-ink-soft">{result.reason}</p>
                    {result.product.shades && (
                      <div className="mt-5">
                        <ShadeChips shades={result.product.shades} value={shadeId} onChange={setShadeId} name="quiz-shade" />
                      </div>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <GooButton type="button" onClick={() => add(result.product.slug, result.product.shades ? shadeId : undefined)}>
                        Add to bag · {formatPrice(result.product.price)}
                      </GooButton>
                      <Link to={`/product/${result.product.slug}${result.product.shades ? `?shade=${shadeId}` : ''}`} className="text-sm font-semibold underline underline-offset-4">
                        Details
                      </Link>
                    </div>
                    {result.pair && (
                      <div className="mt-auto flex items-center gap-4 border-t border-ink/12 pt-6">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-bone">
                          <ProductImage product={result.pair} shade={result.pair.shades?.[0]} sizes="56px" />
                        </div>
                        <p className="min-w-0 flex-1 text-sm">
                          <span className="label block text-ink-soft">pairs with</span>
                          <Link to={`/product/${result.pair.slug}`} className="font-semibold hover:underline">
                            {result.pair.name}
                          </Link>
                        </p>
                        <button
                          type="button"
                          onClick={() => add(result.pair!.slug, result.pair!.shades?.[0].id)}
                          className="rounded-full bg-bone px-4 py-2 text-xs font-semibold transition hover:bg-ink hover:text-bone"
                          aria-label={`Add ${result.pair.name}, ${formatPrice(result.pair.price)}`}
                        >
                          + {formatPrice(result.pair.price)}
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({})
                        go(0)
                      }}
                      className="mt-5 inline-flex items-center gap-2 self-start rounded-full py-2 text-sm font-semibold hover:underline"
                    >
                      <ArrowLeftIcon size={16} /> Retake
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
