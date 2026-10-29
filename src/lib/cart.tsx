import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProduct, type Product, type Shade } from '../data/products'

const STORAGE_KEY = 'haluna-cart-v1'

export interface CartLine {
  slug: string
  shadeId?: string
  quantity: number
}

export interface ResolvedLine extends CartLine {
  key: string
  product: Product
  shade?: Shade
  lineTotal: number
}

interface CartContextValue {
  lines: ResolvedLine[]
  count: number
  subtotal: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (slug: string, shadeId?: string, quantity?: number) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const lineKey = (slug: string, shadeId?: string) => (shadeId ? `${slug}:${shadeId}` : slug)

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is CartLine =>
        typeof l?.slug === 'string' && typeof l?.quantity === 'number' && l.quantity > 0 && !!getProduct(l.slug),
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty on both server and client so the prerendered home page hydrates cleanly,
  // then restore the saved cart right after mount.
  const [raw, setRaw] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    setRaw(loadCart())
    setRestored(true)
  }, [])

  // Save only after the restore has rendered, so the empty first render never overwrites storage.
  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
    } catch {
      /* storage unavailable (private mode): cart still works for this visit */
    }
  }, [raw, restored])

  const add = useCallback((slug: string, shadeId?: string, quantity = 1) => {
    setRaw((prev) => {
      const key = lineKey(slug, shadeId)
      const existing = prev.find((l) => lineKey(l.slug, l.shadeId) === key)
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, quantity: Math.min(l.quantity + quantity, 10) } : l))
      }
      return [...prev, { slug, shadeId, quantity }]
    })
    setIsOpen(true)
  }, [])

  const setQuantity = useCallback((key: string, quantity: number) => {
    setRaw((prev) =>
      quantity <= 0
        ? prev.filter((l) => lineKey(l.slug, l.shadeId) !== key)
        : prev.map((l) => (lineKey(l.slug, l.shadeId) === key ? { ...l, quantity: Math.min(quantity, 10) } : l)),
    )
  }, [])

  const remove = useCallback((key: string) => {
    setRaw((prev) => prev.filter((l) => lineKey(l.slug, l.shadeId) !== key))
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const clear = useCallback(() => setRaw([]), [])

  const value = useMemo<CartContextValue>(() => {
    const lines = raw.flatMap((l) => {
      const product = getProduct(l.slug)
      if (!product) return []
      const shade = product.shades?.find((s) => s.id === l.shadeId)
      return [{ ...l, key: lineKey(l.slug, l.shadeId), product, shade, lineTotal: product.price * l.quantity }]
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      isOpen,
      open,
      close,
      add,
      setQuantity,
      remove,
      clear,
    }
  }, [raw, isOpen, open, close, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
