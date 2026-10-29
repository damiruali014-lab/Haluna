import { Link } from 'react-router'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFound() {
  useDocumentMeta('Page not found', 'This page has drifted off into the sunset.')
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl">This page drifted into the sunset</h1>
      <p className="mt-4 text-ink-soft">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </section>
  )
}
