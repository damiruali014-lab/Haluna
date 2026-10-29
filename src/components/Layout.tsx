import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnnouncementBar, Header } from './Header'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'

/** Scrolls to top on page change, or to the #section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  // New page without a hash: start at the top. (Search-param changes, e.g. picking a shade, keep the scroll position.)
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  // Any navigation to a #section, including clicking the same nav link twice.
  useEffect(() => {
    if (!hash) return
    // wait a tick so the target section has rendered
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 40)
    return () => window.clearTimeout(t)
  }, [hash, key])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
