import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { loadMotion } from '../../motion/load'
import { prefersReducedMotion } from '../../lib/scroll'
import { GooLink } from '../GooButton'
import { Stars } from '../ui'
import { NOZZLE, PHOTO, PILL, RIG, STAGE, TUBE_CLIP, finalState, initialState, type PourState } from './heroGeometry'

const pct = (v: number, of: number) => `${(v / of) * 100}%`
const crop = RIG.crop
const LID_H = PHOTO.capBottom - PHOTO.seam

/**
 * Applies the DOM part of one pour frame: lift, lid hinge, squeeze, nozzle, and the button hand-over.
 * The cream itself is drawn by the WebGL renderer in motion/heroPour.ts.
 */
export function renderRig(root: HTMLElement, s: PourState) {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!
  q<HTMLElement>('[data-rig]').style.transform = `translateY(${((RIG.lift * s.lift) / (crop.h * RIG.scale)) * 100}%)`
  // Flip-top lid swings open on its hinge (real 3D, so you see its white underside).
  q<HTMLElement>('[data-lid]').style.transform = `perspective(520px) rotateY(${-138 * s.lid}deg)`
  q<SVGGElement>('[data-nozzle]').style.opacity = String(Math.min(1, s.lid * 2.2))
  q<SVGGElement>('[data-squeeze]').setAttribute(
    'transform',
    `translate(${PHOTO.cx} 0) scale(${s.squeeze} 1) translate(${-PHOTO.cx} 0)`,
  )
  q<SVGEllipseElement>('[data-tube-shadow]').setAttribute('opacity', (0.13 - 0.04 * s.lift).toFixed(3))
  const cta = q<HTMLElement>('[data-pour-cta]')
  const on = s.pill > 0.97
  cta.style.opacity = on ? '1' : '0'
  cta.style.pointerEvents = on ? 'auto' : 'none'
  cta.toggleAttribute('inert', !on)
}

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const section = sectionRef.current
    if (!stage || !section) return
    if (prefersReducedMotion()) {
      renderRig(stage, finalState())
      return
    }
    renderRig(stage, initialState())
    let cleanup: (() => void) | undefined
    let cancelled = false
    loadMotion().then((m) => {
      if (!m || cancelled) return
      m.startSmoothScroll()
      cleanup = m.heroPour(section, stage, renderRig)
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  // On desktop the stage stays in view (CSS sticky) while the extra 75vh of scroll drives the pour.
  return (
    <section ref={sectionRef} className="relative isolate -mt-[72px] motion-safe:lg:h-[calc(100svh+75vh)]" aria-labelledby="hero-title">
      <div className="overflow-clip pt-[72px] motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-svh">
      <div className="container-page grid min-h-[min(100svh,1000px)] grid-cols-1 items-center gap-10 pt-6 pb-14 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 lg:py-8">
        <div className="relative lg:pl-16">
          {/* Packaging-style vertical rail */}
          <p aria-hidden="true" className="vertical-caps absolute top-1 left-0 hidden text-[11px] text-ink-soft lg:block">
            Haluna · daily mineral sunscreen
          </p>
          <p className="label text-ink-soft">daily mineral sunscreen<span className="max-sm:hidden"> · spf 50 · reef-safe</span></p>
          <h1 id="hero-title" className="display mt-6 text-display-xl text-ink">
            Sun care that <span className="text-rosewood">disappears</span> into your skin.
          </h1>
          <p className="mt-7 max-w-md text-body-l text-ink-soft">
            Weightless mineral filters, no white cast, no shine. The SPF you forget you're wearing, from morning coffee to golden hour.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <GooLink to="/#shop" variant="ink">
              Shop now
            </GooLink>
            <Link to="/#quiz" className="btn-line">
              Find your SPF
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft" aria-label="Why people trust Haluna">
            <li className="flex items-center gap-2">
              <Stars rating={4.9} />
              <span>
                <strong className="font-semibold text-ink">4.9</strong> · 2,000+ reviews
              </span>
            </li>
            <li>Dermatologist tested</li>
            <li>Reef-safe minerals</li>
          </ul>
        </div>

        {/* Pour stage */}
        <div ref={stageRef} className="relative mx-auto w-full max-w-[520px] lg:max-w-[600px]">
          <div
            className="relative aspect-[600/760] overflow-hidden rounded-arch bg-sand"
            role="img"
            aria-label="A tube of Haluna Daily Mineral Sunscreen opening its cap and squeezing out a dollop of cream"
          >
            <img
              src="/images/r/hero-shadow.webp"
              alt=""
              width={720}
              height={1321}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Stone plinth and the tube's soft shadow */}
            <svg viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="hl-plinth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#E7D7C1" />
                  <stop offset="1" stopColor="#CDB597" />
                </linearGradient>
                <filter id="hl-stone" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
                  <feColorMatrix in="n" values="0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0.22 0" result="grain" />
                  <feComposite in="grain" in2="SourceGraphic" operator="in" result="g2" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="g2" />
                  </feMerge>
                </filter>
                <radialGradient id="hl-tube-shadow">
                  <stop offset="0" stopColor="#4A2B3A" stopOpacity="1" />
                  <stop offset="1" stopColor="#4A2B3A" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="-10" y={STAGE.floorY} width={STAGE.w + 20} height={STAGE.h - STAGE.floorY} fill="url(#hl-plinth)" filter="url(#hl-stone)" />
              <rect x="-10" y={STAGE.floorY} width={STAGE.w + 20} height="1.5" fill="#F6ECDF" />
              <ellipse data-tube-shadow cx={NOZZLE.x} cy={STAGE.floorY + 10} rx="120" ry="12" fill="url(#hl-tube-shadow)" opacity="0.13" />
            </svg>

            {/* The tube rig: the real product photo, split into body, cap, nozzle and a hinged lid. */}
            <div
              data-rig
              className="absolute will-change-transform"
              style={{
                left: pct(RIG.x, STAGE.w),
                top: pct(RIG.y, STAGE.h),
                width: pct(crop.w * RIG.scale, STAGE.w),
                height: pct(crop.h * RIG.scale, STAGE.h),
              }}
            >
              <svg viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <defs>
                  <clipPath id="hl-tube" clipPathUnits="userSpaceOnUse">
                    <path d={TUBE_CLIP} />
                  </clipPath>
                  <clipPath id="hl-tube-body" clipPathUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="1200" height={PHOTO.capTop} />
                  </clipPath>
                  <clipPath id="hl-cap-body" clipPathUnits="userSpaceOnUse">
                    <rect x="0" y={PHOTO.capTop - 1} width="1200" height={PHOTO.seam - PHOTO.capTop + 1} />
                  </clipPath>
                  <linearGradient id="hl-nozzle" x1="0" x2="1">
                    <stop offset="0" stopColor="#E9E6E0" />
                    <stop offset="0.35" stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#D9D4CC" />
                  </linearGradient>
                </defs>
                {/* Nozzle, revealed when the lid swings open */}
                <g data-nozzle opacity="0">
                  <path d={`M${PHOTO.cx - 30} ${PHOTO.seam - 4}h60v15q0 13-13 15h-34q-13-2-13-15z`} fill="url(#hl-nozzle)" />
                  <ellipse cx={PHOTO.cx} cy={PHOTO.nozzleTip - 3} rx="15" ry="4" fill="#B9AFA2" />
                  <rect x={PHOTO.capLeft + 2} y={PHOTO.seam - 3} width={PHOTO.capRight - PHOTO.capLeft - 4} height="4" rx="2" fill="#D6D0C6" />
                </g>
                {/* Squeezable body */}
                <g data-squeeze>
                  <g clipPath="url(#hl-tube-body)">
                    <image href="/images/product-sunscreen.webp" width="1200" height="1200" clipPath="url(#hl-tube)" />
                  </g>
                </g>
                {/* Cap (fixed part) */}
                <g clipPath="url(#hl-cap-body)">
                  <image href="/images/product-sunscreen.webp" width="1200" height="1200" clipPath="url(#hl-tube)" />
                </g>
              </svg>
              {/* Hinged flip-top lid: the real lid from the photo on the front, white plastic underside on the back. */}
              <div
                data-lid
                className="absolute [transform-style:preserve-3d] will-change-transform"
                style={{
                  left: pct(PHOTO.capLeft - crop.x, crop.w),
                  top: pct(PHOTO.seam - crop.y, crop.h),
                  width: pct(PHOTO.capRight - PHOTO.capLeft, crop.w),
                  height: pct(LID_H, crop.h),
                  transformOrigin: '100% 0%',
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-b-[30%_60%] [backface-visibility:hidden]">
                  <img
                    src="/images/product-sunscreen.webp"
                    alt=""
                    className="absolute max-w-none"
                    style={{
                      width: pct(1200, PHOTO.capRight - PHOTO.capLeft),
                      left: pct(-PHOTO.capLeft, PHOTO.capRight - PHOTO.capLeft),
                      top: pct(-PHOTO.seam, LID_H),
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-b-[30%_60%] bg-[linear-gradient(90deg,#d9d3ca,#f7f4ef_40%,#e4dfd7)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="absolute top-[18%] left-1/2 h-[46%] w-[14%] -translate-x-1/2 rounded-b-full bg-[linear-gradient(90deg,#cfc8bd,#fbf9f5,#d6cfc4)]" />
                </div>
              </div>
            </div>

            {/* Cream (WebGL, drawn by motion/heroPour.ts) */}
            <canvas data-cream className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

            {/* The settled cream becomes this button. */}
            <div
              data-pour-cta
              inert
              className="absolute -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-[var(--dur-base)]"
              style={{
                left: pct(NOZZLE.x, STAGE.w),
                top: pct(STAGE.floorY - PILL.h / 2, STAGE.h),
                width: pct(PILL.w, STAGE.w),
                height: pct(PILL.h, STAGE.h),
              }}
            >
              <GooLink to="/#shop" variant="cream" className="!h-full !w-full !px-2 !py-0 text-[clamp(11px,2.6vw,14px)] whitespace-nowrap shadow-[var(--shadow-cream)]">
                Shop the collection
              </GooLink>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-between gap-4 text-xs text-ink-soft">
            <span className="label">no. 01</span>
            <span>Daily Mineral Sunscreen SPF 50 · 50 ml · $28</span>
          </p>
        </div>
      </div>
      </div>
    </section>
  )
}
