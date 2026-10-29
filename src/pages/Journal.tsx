import { Link } from 'react-router'
import { journal } from '../data/content'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Img } from '../components/Img'
import { Reveal } from '../components/ui'

export default function Journal() {
  useDocumentMeta('Journal', 'Short, practical notes on sun care and summer colour from Haluna.')
  return (
    <div className="container-page pt-10 pb-24">
      <p className="label text-ink-soft">the haluna journal</p>
      <h1 className="display mt-5 max-w-4xl text-display-xl">Notes from the shady side.</h1>

      <nav aria-label="Articles" className="mt-12 flex flex-wrap gap-2">
        {journal.map((a) => (
          <a key={a.slug} href={`#${a.slug}`} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold transition hover:border-ink">
            {a.title}
          </a>
        ))}
      </nav>

      <div className="mt-16 space-y-24">
        {journal.map((a, i) => (
          <Reveal key={a.slug}>
            <article id={a.slug} className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="overflow-hidden rounded-arch bg-sand">
                <Img src={a.image} alt="" sizes="(min-width: 1024px) 45vw, 95vw" className="aspect-[4/5] h-full w-full object-cover" />
              </div>
              <div>
                <p className="label text-ink-soft">no. 0{i + 1}</p>
                <h2 className="display mt-4 text-display-m">{a.title}</h2>
                <p className="mt-4 text-body-l text-ink-soft">{a.dek}</p>
                {a.body.map((para) => (
                  <p key={para.slice(0, 20)} className="mt-5 max-w-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 flex flex-wrap items-center justify-between gap-6 rounded-panel bg-sand p-8 sm:p-12">
        <p className="display text-display-m">Not sure where to start?</p>
        <Link to="/#quiz" className="btn-ink">
          Take the SPF quiz
        </Link>
      </div>
    </div>
  )
}
