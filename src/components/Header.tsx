import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router'
import { useCart } from '../lib/cart'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { Logo } from './Logo'
import { BagIcon, CloseIcon, MenuIcon } from './Icons'

export const NAV = [
  { label: 'Shop', to: '/#shop' },
  { label: 'Ingredients', to: '/#ingredients' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'FAQ', to: '/#faq' },
]

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-xs font-medium tracking-wide text-cream sm:text-[13px]">
      Free shipping over $50 <span aria-hidden="true" className="mx-1.5 text-sun">·</span> Reef-friendly formulas
    </div>
  )
}

export function Header() {
  const { count, open } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useFocusTrap(menuRef, menuOpen, closeMenu)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const solid = scrolled || menuOpen

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid ? 'bg-cream/90 shadow-[0_1px_0_rgb(43_30_22/0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <button
          type="button"
          className="-ml-2 grid h-11 w-11 place-items-center rounded-full md:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon size={22} />
        </button>

        <Link to="/" className="shrink-0 rounded-md max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2" aria-label="Haluna home">
          <Logo className="h-7 w-auto sm:h-8" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/#quiz" className="btn-ghost hidden !px-4 !py-2 lg:inline-flex">
            Find your SPF
          </Link>
          <button
            type="button"
            onClick={open}
            className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full transition hover:bg-ink/5"
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <BagIcon size={22} />
            {count > 0 && (
              <span
                key={count}
                className="absolute top-1 right-0.5 grid h-5 min-w-5 animate-fade-in place-items-center rounded-full bg-sun px-1 text-[11px] font-semibold text-ink"
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu: portalled to <body> so the header's backdrop-filter doesn't become its containing block. */}
      {createPortal(
      <div
        className={`fixed inset-0 z-50 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          className={`absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col bg-cream p-6 shadow-lift transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <Logo className="h-7 w-auto" />
            <button type="button" onClick={closeMenu} className="-mr-2 grid h-11 w-11 place-items-center rounded-full" aria-label="Close menu">
              <CloseIcon size={22} />
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} onClick={closeMenu} className="block py-3 font-display text-3xl">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link to="/#quiz" onClick={closeMenu} className="btn-primary mt-auto">
            Find your SPF
          </Link>
        </div>
      </div>,
        document.body,
      )}
    </header>
  )
}
