import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { CartProvider } from './lib/cart'
import { routes } from './routes'
import './index.css'

const router = createBrowserRouter(routes)

const app = (
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
)

// The home page ships prerendered HTML (scripts/prerender.mjs), which is hydrated in place so the
// hero paints before JavaScript runs. Every other route starts from the empty app shell.
const root = document.getElementById('root')!
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
