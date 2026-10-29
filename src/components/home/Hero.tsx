import { Link } from 'react-router'
import { products } from '../../data/products'
import { site } from '../../data/site'
import { ProductVisual } from '../ProductVisual'
import { ArrowRightIcon, CheckIcon } from '../Icons'
import { Stars } from '../ui'

export function Hero() {
  const [fluid, tint, mist] = products
  return (
    <section className="grain relative isolate -mt-16 overflow-clip pt-16 sm:-mt-[72px] sm:pt-[72px]" aria-labelledby="hero-title">
      {/* sun glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-20%] h-[70vw] max-h-[820px] w-[70vw] max-w-[820px] rounded-full bg-[radial-gradient(circle,#F7B27F_0%,#FBD9BE_35%,rgba(251,247,241,0)_70%)] sm:right-[-5%]" />
        <div className="absolute bottom-[-30%] left-[-20%] h-[60vw] max-h-[600px] w-[60vw] max-w-[600px] rounded-full bg-[radial-gradient(circle,#E3E9DD_0%,rgba(251,247,241,0)_70%)]" />
      </div>

      <div className="container-page grid items-center grid-cols-1 gap-10 pt-10 pb-16 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pt-20 lg:pb-24">
        <div className="max-w-xl">
          <p className="eyebrow mb-5">Mineral SPF · Reef-friendly</p>
          <h1 id="hero-title" className="text-[clamp(2.9rem,8vw,5.6rem)] leading-[0.98] font-light">
            Sun care that feels like <em className="font-normal text-sun-deep italic">nothing.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Weightless mineral sunscreens with no white cast, no greasy shine and no compromise. Just skin that feels like
            yours, all day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/#shop" className="btn-primary">
              Shop now <ArrowRightIcon size={18} />
            </Link>
            <Link to="/#quiz" className="btn-ghost">
              Find your SPF
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-soft" aria-label="Why people trust Haluna">
            <li className="flex items-center gap-2">
              <Stars rating={4.8} />
              <span>
                <strong className="font-semibold text-ink">4.8</strong> from 2,000+ reviews
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckIcon size={16} className="text-sage-deep" />
              Dermatologist tested
            </li>
            <li className="flex items-center gap-1.5">
              <CheckIcon size={16} className="text-sage-deep" />
              No white cast
            </li>
          </ul>
        </div>

        <div className="relative mx-auto aspect-[5/4] w-full max-w-[620px]">
          {site.heroImage ? (
            <img
              src={site.heroImage}
              alt="Haluna sunscreens on a sunlit stone surface"
              className="h-full w-full rounded-[2rem] object-cover shadow-lift"
              fetchPriority="high"
            />
          ) : (
            <div className="relative h-full w-full" role="img" aria-label="The Haluna sun care trio: Daily Fluid, Glow Tint and Body Mist">
              <div className="absolute inset-[6%] rounded-[2.5rem] bg-white/40 shadow-soft ring-1 ring-white/60 backdrop-blur-sm" />
              <ProductVisual product={tint} shade={tint.shades?.[1]} className="!absolute bottom-[11%] left-[9%] h-[60%] w-[28%]" variant={1} bare />
              <ProductVisual product={mist} className="!absolute right-[9%] bottom-[11%] h-[64%] w-[28%]" variant={2} bare />
              <ProductVisual product={fluid} className="!absolute bottom-[9%] left-1/2 h-[74%] w-[32%] -translate-x-1/2" priority bare />
              <div className="absolute top-[3%] left-[2%] z-10 hidden rounded-2xl bg-white/90 px-4 py-3 text-sm shadow-soft backdrop-blur sm:block">
                <p className="font-display text-2xl leading-none">0%</p>
                <p className="mt-1 text-xs text-ink-soft">white cast</p>
              </div>
              <div className="absolute right-[2%] top-[3%] z-10 hidden rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur sm:block">
                <p className="text-xs text-ink-soft">Absorbs in</p>
                <p className="font-display text-2xl leading-none">~30 sec</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
