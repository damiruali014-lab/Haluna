import { lazy, Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnnouncementBar, Header } from './Header'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { GooFilterDefs } from './GooButton'
import { scrollToElement, scrollToTop } from '../lib/scroll'

const CreamCursor = lazy(() => import('./CreamCursor'))

// A refresh should start at the top, not wherever the browser last was (or the last #section).
if (typeof history !== 'undefined' && 'scrollRestoration' in history) history.scrollRestoration = 'manual'
const isReload =
  typeof performance !== 'undefined' &&
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload'
let firstHashRun = true

/** Drops the #section from the address bar once we've scrolled there, so a refresh starts at the top. */
function clearHash() {
  history.replaceState(history.state, '', window.location.pathname + window.location.search)
}

/** Scrolls to top on page change, or to the #section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  // New page without a hash: start at the top. (Search-param changes, e.g. picking a shade, keep the position.)
  useEffect(() => {
    if (!window.location.hash) scrollToTop()
  }, [pathname])
  // Any navigation to a #section, including clicking the same nav link twice.
  // A shared link like /#shop still jumps to the section; a reload of it starts at the top.
  useEffect(() => {
    if (!hash) return
    if (firstHashRun && isReload) {
      firstHashRun = false
      clearHash()
      scrollToTop()
      return
    }
    firstHashRun = false
    const t = window.setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) scrollToElement(el)
      clearHash()
    }, 60)
    return () => window.clearTimeout(t)
  }, [hash, key])
  return null
}

export function Layout() {
  // Browser-only extras mount after hydration so the prerendered HTML matches the first client render.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-bone focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <GooFilterDefs />
      <ScrollManager />
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      {mounted && (
        <Suspense fallback={null}>
          <CreamCursor />
        </Suspense>
      )}
    </div>
  )
}
