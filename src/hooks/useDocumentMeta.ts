import { useEffect } from 'react'

const SITE = 'Haluna'

/** Sets the page title and meta description for the current route. */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title.includes(SITE) ? title : `${title} | ${SITE}`
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
  }, [title, description])
}
