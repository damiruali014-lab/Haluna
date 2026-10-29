import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { CartProvider } from './lib/cart'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'
import './index.css'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/product/:slug', element: <ProductPage /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
