import type { RouteObject } from 'react-router'
import { Layout } from './components/Layout'
import Home from './pages/Home'

/** Shared by the browser router (main.tsx) and the build-time prerender (entry-server.tsx). */
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      // Code-split routes. The router waits for the chunk before rendering, so there is no fallback flash.
      { path: '/product/:slug', lazy: () => import('./pages/ProductPage').then((m) => ({ Component: m.default })) },
      { path: '/checkout', lazy: () => import('./pages/Checkout').then((m) => ({ Component: m.default })) },
      { path: '/journal', lazy: () => import('./pages/Journal').then((m) => ({ Component: m.default })) },
      { path: '*', lazy: () => import('./pages/NotFound').then((m) => ({ Component: m.default })) },
    ],
  },
]
