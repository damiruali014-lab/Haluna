import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { CartProvider } from './lib/cart'
import { routes } from './routes'

/** Renders a route to HTML at build time. Used by scripts/prerender.mjs for the home page. */
export async function render(url: string) {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(`http://localhost${url}`))
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${url}`)
  const router = createStaticRouter(handler.dataRoutes, context)
  return renderToString(
    <StrictMode>
      <CartProvider>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </CartProvider>
    </StrictMode>,
  )
}
