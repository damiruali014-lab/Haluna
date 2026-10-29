import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { formatPrice, getProduct, type Product } from '../../data/products'
import { useCart } from '../../lib/cart'
import { ProductVisual } from '../ProductVisual'
import { ArrowLeftIcon, ArrowRightIcon } from '../Icons'
import { Reveal, ShadeChips, Stars } from '../ui'

type Answers = { skin?: string; where?: string; finish?: string }

const QUESTIONS: { key: keyof Answers; title: string; options: { value: string; label: string; hint: string }[] }[] = [
  {
    key: 'skin',
    title: 'How would you describe your skin?',
    options: [
      { value: 'dry', label: 'Dry', hint: 'Feels tight, loves moisture' },
      { value: 'oily', label: 'Oily or combination', hint: 'Shine by midday' },
      { value: 'sensitive', label: 'Sensitive', hint: 'Easily red or reactive' },
      { value: 'normal', label: 'Balanced', hint: 'Rarely gives you trouble' },
    ],
  },
  {
    key: 'where',
    title: 'Where will you use it most?',
    options: [
      { value: 'face', label: 'Face, every day', hint: 'Commute, desk, errands' },
      { value: 'body', label: 'Body', hint: 'Beach, pool, park' },
      { value: 'both', label: 'A bit of everything', hint: 'Weekends outdoors' },
    ],
  },
  {
    key: 'finish',
    title: 'Tinted or clear?',
    options: [
      { value: 'clear', label: 'Clear', hint: 'Invisible, goes under anything' },
      { value: 'tinted', label: 'Tinted', hint: 'Sheer coverage and glow' },
    ],
  },
]

function recommend(a: Required<Answers>): { product: Product; reason: string } {
  const skinNote: Record<string, string> = {
    dry: 'Hyaluronic acid keeps dry skin comfortable all day.',
    oily: 'The fast-absorbing, shine-free finish is great for oily skin.',
    sensitive: 'Fragrance-free mineral zinc is the gentlest choice for sensitive skin.',
    normal: 'An easy, feel-nothing finish for balanced skin.',
  }
  if (a.where === 'body') {
    return { product: getProduct('body-mist-spf-50')!, reason: `A fast, even mist for shoulders, legs and backs. ${skinNote[a.skin]}` }
  }
  if (a.finish === 'tinted') {
    return { product: getProduct('glow-tint-spf-30')!, reason: `Sheer coverage that evens tone while it protects. ${skinNote[a.skin]}` }
  }
  return { product: getProduct('daily-fluid-spf-50')!, reason: `Our lightest SPF 50, invisible under makeup. ${skinNote[a.skin]}` }
}

export function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [shadeId, setShadeId] = useState('medium')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const touched = useRef(false)
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

  return (
    <section id="quiz" className="py-20 sm:py-28" aria-labelledby="quiz-title">
      <div className="container-page">
        <Reveal className="grain relative isolate overflow-clip rounded-[2rem] bg-sand-soft px-5 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div aria-hidden="true" className="absolute -right-24 -bottom-24 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,#F7B27F_0%,rgba(244,237,227,0)_70%)]" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-3">60-second quiz</p>
              <h2 id="quiz-title" className="text-4xl leading-[1.05] sm:text-5xl">
                Find your SPF
              </h2>
              <p className="mt-4 max-w-sm text-ink-soft">Three quick questions and we'll match you with the formula your skin will love.</p>
              <ol className="mt-8 flex gap-2" aria-label="Quiz progress">
                {QUESTIONS.map((_, i) => (
                  <li
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? 'bg-sun' : i === step ? 'bg-ink' : 'bg-ink/10'}`}
                  >
                    <span className="sr-only">
                      Question {i + 1} {i < step ? '(answered)' : i === step ? '(current)' : ''}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
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
                      <span className="text-sm text-ink-soft">
                        Question {step + 1} of {QUESTIONS.length}
                      </span>
                      <h3 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl outline-none">
                        {q.title}
                      </h3>
                    </legend>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {q.options.map((o) => (
                        <label
                          key={o.value}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 bg-white p-4 transition hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:shadow-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sun-deep"
                        >
                          <input
                            type="radio"
                            name={q.key}
                            value={o.value}
                            checked={answers[q.key] === o.value}
                            onChange={() => setAnswers((a) => ({ ...a, [q.key]: o.value }))}
                            className="mt-1 h-4 w-4 accent-[#2B1E16]"
                          />
                          <span>
                            <span className="block font-medium">{o.label}</span>
                            <span className="block text-sm text-ink-soft">{o.hint}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => go(step - 1)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-ink/5 ${step === 0 ? 'invisible' : ''}`}
                    >
                      <ArrowLeftIcon size={16} /> Back
                    </button>
                    <button type="submit" className="btn-dark" disabled={!answers[q.key]}>
                      {step === QUESTIONS.length - 1 ? 'See my match' : 'Next'} <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                result && (
                  <div className="animate-fade-in">
                    <p className="text-sm text-ink-soft">Your match</p>
                    <h3 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl outline-none">
                      {result.product.name}
                    </h3>
                    <div className="mt-6 grid gap-6 rounded-panel bg-white p-4 shadow-soft sm:grid-cols-[180px_1fr] sm:p-5">
                      <ProductVisual
                        product={result.product}
                        shade={result.product.shades?.find((s) => s.id === shadeId)}
                        className="aspect-[4/5] rounded-2xl sm:aspect-auto sm:h-full"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-ink-soft">
                          <Stars rating={result.product.rating} /> {result.product.rating} ({result.product.reviewCount})
                        </div>
                        <p className="mt-3 leading-relaxed">{result.reason}</p>
                        {result.product.shades && (
                          <div className="mt-4">
                            <ShadeChips shades={result.product.shades} value={shadeId} onChange={setShadeId} name="quiz-shade" />
                          </div>
                        )}
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => add(result.product.slug, result.product.shades ? shadeId : undefined)}
                          >
                            Add to cart · {formatPrice(result.product.price)}
                          </button>
                          <Link to={`/product/${result.product.slug}${result.product.shades ? `?shade=${shadeId}` : ''}`} className="text-sm font-medium underline underline-offset-4">
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({})
                        go(0)
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-ink/5"
                    >
                      <ArrowLeftIcon size={16} /> Retake quiz
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
