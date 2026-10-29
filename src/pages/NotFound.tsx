import { Link } from 'react-router'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Mark } from '../components/Logo'

export default function NotFound() {
  useDocumentMeta('Page not found', 'This page has melted into the skin.')
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Mark className="h-16 w-16" title="" />
      <p className="label mt-8 text-ink-soft">404</p>
      <h1 className="display mt-4 text-display-l">This page disappeared into the skin.</h1>
      <p className="mt-5 text-ink-soft">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="btn-ink mt-10">
        Back to Haluna
      </Link>
    </section>
  )
}
