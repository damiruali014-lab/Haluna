import { Link } from 'react-router'
import { products } from '../data/products'
import { Logo } from './Logo'
import { InstagramIcon, PinterestIcon, TikTokIcon } from './Icons'

const PORTFOLIO_URL = 'https://damiruali014-lab.github.io'

export function Footer() {
  return (
    <footer className="mt-auto bg-sand-soft pt-16 pb-8">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Sun care that feels like nothing. Mineral, reef-friendly and made for every day.
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {[
                { label: 'Instagram', Icon: InstagramIcon },
                { label: 'TikTok', Icon: TikTokIcon },
                { label: 'Pinterest', Icon: PinterestIcon },
              ].map(({ label, Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition hover:border-ink hover:bg-ink hover:text-cream"
                    aria-label={`Haluna on ${label} (demo link)`}
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterCol title="Shop">
            {products.map((p) => (
              <li key={p.slug}>
                <Link to={`/product/${p.slug}`}>{p.shortName} SPF {p.spf}</Link>
              </li>
            ))}
            <li>
              <Link to="/#quiz">Find your SPF</Link>
            </li>
          </FooterCol>
          <FooterCol title="Learn">
            <li>
              <Link to="/#ingredients">Ingredients</Link>
            </li>
            <li>
              <Link to="/#reviews">Reviews</Link>
            </li>
            <li>
              <Link to="/#faq">FAQ</Link>
            </li>
          </FooterCol>
          <FooterCol title="Help">
            <li>Shipping &amp; returns</li>
            <li>Contact</li>
            <li>Privacy</li>
          </FooterCol>
        </div>

        <div className="mt-14 rounded-panel bg-ink px-6 py-6 text-cream sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-8">
          <p className="text-sm leading-relaxed text-cream/85">
            Concept website by <strong className="font-semibold text-cream">Damir Uali</strong>. Haluna is a fictional brand.
            <br className="hidden sm:block" /> Like it?{' '}
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener" className="font-medium text-cream underline underline-offset-4 hover:text-sun">
              I can build one for your business.
            </a>
          </p>
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener" className="btn mt-4 shrink-0 bg-sun text-ink hover:bg-[#f49a5f] sm:mt-0">
            See my work
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <p className="mt-8 text-xs text-ink-soft">© {new Date().getFullYear()} Haluna (demo). No real products are sold.</p>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.16em] text-ink uppercase">{title}</h2>
      <ul className="space-y-2.5 text-sm text-ink-soft [&_a]:transition [&_a:hover]:text-ink">{children}</ul>
    </div>
  )
}
