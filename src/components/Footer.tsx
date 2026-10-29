import { Link } from 'react-router'
import { products } from '../data/products'
import { Wordmark, WordmarkVertical } from './Logo'
import { InstagramIcon, PinterestIcon, TikTokIcon } from './Icons'

const PORTFOLIO_URL = 'https://damiruali014-lab.github.io'

export function Footer() {
  return (
    <footer className="on-dusk relative mt-auto overflow-clip bg-dusk text-bone">
      <div className="container-page grid grid-cols-1 gap-12 pt-20 pb-10 md:grid-cols-[auto_1fr] md:gap-16 lg:gap-24">
        <WordmarkVertical className="hidden h-[min(64vh,560px)] w-auto text-bone md:block" />

        <div className="flex flex-col">
          <Wordmark className="mb-12 h-7 w-auto self-start text-bone md:hidden" />
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <FooterCol title="Shop">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link to={`/product/${p.slug}`}>{p.name.replace(/ SPF \d+/, '')}</Link>
                </li>
              ))}
            </FooterCol>
            <FooterCol title="Discover">
              <li>
                <Link to="/#quiz">Find your SPF</Link>
              </li>
              <li>
                <Link to="/#uv">UV today</Link>
              </li>
              <li>
                <Link to="/#ingredients">Ingredients</Link>
              </li>
              <li>
                <Link to="/journal">Journal</Link>
              </li>
            </FooterCol>
            <FooterCol title="Help">
              <li>
                <Link to="/#faq">FAQ</Link>
              </li>
              <li>Shipping &amp; returns</li>
              <li>Contact</li>
            </FooterCol>
            <FooterCol title="Follow">
              {[
                { label: 'Instagram', Icon: InstagramIcon },
                { label: 'TikTok', Icon: TikTokIcon },
                { label: 'Pinterest', Icon: PinterestIcon },
              ].map(({ label, Icon }) => (
                <li key={label}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2" aria-label={`Haluna on ${label} (demo link)`}>
                    <Icon size={16} /> {label}
                  </a>
                </li>
              ))}
            </FooterCol>
          </div>

          <p className="display mt-16 max-w-3xl text-display-m text-bone">
            Concept website by{' '}
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener" className="underline decoration-blush decoration-1 underline-offset-[0.18em] hover:text-blush">
              Damir Uali
            </a>
            . Haluna is a fictional brand. Like it?{' '}
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener" className="text-blush underline decoration-1 underline-offset-[0.18em] hover:text-bone">
              I can build one for your business.
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t border-bone/15 pt-6 text-xs text-dusk-soft">
            <p>© {new Date().getFullYear()} Haluna (demo). No real products are sold.</p>
            <p className="label">halo + luna</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="label mb-5 font-sans text-dusk-soft">{title}</h2>
      <ul className="space-y-3 text-sm text-bone/90 [&_a]:transition [&_a:hover]:text-blush">{children}</ul>
    </div>
  )
}
