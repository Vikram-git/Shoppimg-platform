import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { lineCompareTotal, lineSubtotal, lineSavings } from '../utils/pricing'
import { products, type Product } from '../data/products'

export type CartLine = {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'arcadia-cart-v1'

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  /** Sum at list / compare-at prices (for “you saved” messaging). */
  compareSubtotal: number
  savings: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { id: string; quantity: number }[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((row) => {
        const product = products.find((p) => p.id === row.id)
        if (!product || row.quantity < 1) return null
        return { product, quantity: Math.min(99, row.quantity) }
      })
      .filter(Boolean) as CartLine[]
  } catch {
    return []
  }
}

function persist(lines: CartLine[]) {
  const payload = lines.map((l) => ({ id: l.product.id, quantity: l.quantity }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    if (typeof window === 'undefined') return []
    return loadLines()
  })

  useEffect(() => {
    persist(lines)
  }, [lines])

  const addItem = useCallback((product: Product, quantity = 1) => {
    const q = Math.max(1, Math.min(99, quantity))
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === product.id)
      if (i === -1) return [...prev, { product, quantity: q }]
      const next = [...prev]
      next[i] = {
        ...next[i],
        quantity: Math.min(99, next[i].quantity + q),
      }
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const q = Math.floor(quantity)
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.product.id !== productId))
      return
    }
    setLines((prev) =>
      prev.map((l) =>
        l.product.id === productId ? { ...l, quantity: Math.min(99, q) } : l,
      ),
    )
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0)
    const subtotal = lines.reduce((n, l) => n + lineSubtotal(l.product, l.quantity), 0)
    const compareSubtotal = lines.reduce((n, l) => n + lineCompareTotal(l.product, l.quantity), 0)
    const savings = lines.reduce((n, l) => n + lineSavings(l.product, l.quantity), 0)
    return {
      lines,
      itemCount,
      subtotal,
      compareSubtotal,
      savings,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }
  }, [lines, addItem, removeItem, setQuantity, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
