import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router'
import { useCart } from '../lib/cart'
import { uvLevel, useUV } from '../lib/uv'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { Mark, Wordmark } from './Logo'
import { BagIcon, CloseIcon, MenuIcon } from './Icons'

export const NAV = [
  { label: 'Shop', to: '/#shop' },
  { label: 'Sun care', to: '/?shop=sun#shop' },
  { label: 'Color', to: '/#color' },
  { label: 'Ingredients', to: '/#ingredients' },
  { label: 'Journal', to: '/journal' },
]

export function AnnouncementBar() {
  return (
    <div className="on-dusk bg-dusk px-4 py-2 text-center text-[11px] font-medium tracking-[0.22em] text-bone uppercase">
      free shipping over $50 <span aria-hidden="true" className="mx-2 text-blush">✦</span> reef-safe mineral filters
    </div>
  )
}

function UVBadge() {
  const uv = useUV()
  const value = uv.uv
  const level = value !== undefined ? uvLevel(value) : null
  return (
    <Link
      to="/#uv"
      className="hidden items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold transition hover:border-ink sm:inline-flex"
      aria-label={value !== undefined ? `UV index today in ${uv.place.label}: ${value}, ${level?.label}. See advice.` : 'UV index today'}
    >
      <span className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/20" style={{ background: level?.color ?? 'transparent' }} aria-hidden="true" />
      <span aria-hidden="true">
        UV {value !== undefined ? Math.round(value) : '–'}
        <span className="ml-1 font-normal text-ink-soft">{uv.place.label}</span>
      </span>
    </Link>
  )
}

export function Header() {
  const { count, open } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // The menu is portalled to <body>, so it mounts only after hydration.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useFocusTrap(menuRef, menuOpen, closeMenu)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const solid = scrolled || menuOpen

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-[var(--dur-base)] ${
        solid ? 'bg-bone/92 shadow-[0_1px_0_rgb(28_26_23/0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <button
            type="button"
            className="-ml-2 grid h-11 w-11 place-items-center rounded-full lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon size={22} />
          </button>
          <Link to="/" className="rounded-md max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2" aria-label="Haluna home">
            <Wordmark className="h-[15px] w-auto sm:h-[17px]" />
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="rounded-full px-3.5 py-2 text-[13px] font-medium text-ink/75 transition hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <UVBadge />
          <button
            type="button"
            onClick={open}
            className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full transition hover:bg-ink/5"
            aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <BagIcon size={21} />
            {count > 0 && (
              <span
                key={count}
                className="absolute top-1 right-0 grid h-[18px] min-w-[18px] animate-fade-in place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-bone"
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
        <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen} inert={!menuOpen}>
          <div
            className={`absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-[var(--dur-base)] ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMenu}
          />
          <div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            className={`on-dusk absolute inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col bg-dusk p-6 text-bone transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="mb-12 flex items-center justify-between">
              <Mark className="h-8 w-8 text-bone" />
              <button type="button" onClick={closeMenu} className="-mr-2 grid h-11 w-11 place-items-center rounded-full" aria-label="Close menu">
                <CloseIcon size={22} />
              </button>
            </div>
            <nav aria-label="Mobile">
              <ul>
                {NAV.map((item, i) => (
                  <li key={item.label} className="border-b border-bone/12">
                    <Link to={item.to} onClick={closeMenu} className="display flex items-baseline justify-between py-4 text-[2.4rem] leading-none">
                      {item.label}
                      <span className="font-sans text-xs text-dusk-soft tabular-nums">0{i + 1}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link to="/#quiz" onClick={closeMenu} className="btn-bone mt-auto">
              Find your SPF
            </Link>
          </div>
        </div>,
        document.body,
      )}
    </header>
  )
}
