import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import type { Book } from '../catalog/catalog.types'
import { useCatalog } from '../catalog/catalog.context'
import { useAuth } from '../auth/auth.context'
import { getUserCart, removeUserCartLine, saveUserCartLine } from './cart.service'
import type { CartLine } from './cart.types'
import { cartReducer, mergeCartLines } from './cart.reducer'

const GUEST_CART_KEY = 'lantern-and-leaf-guest-cart'

function readGuestCart(): CartLine[] {
  try {
    const value = localStorage.getItem(GUEST_CART_KEY)
    return value ? JSON.parse(value) as CartLine[] : []
  } catch {
    return []
  }
}

interface CartContextValue {
  lines: CartLine[]
  detailedLines: { book: Book; quantity: number }[]
  itemCount: number
  subtotal: number
  addItem: (bookId: string, quantity?: number) => void
  updateQuantity: (bookId: string, quantity: number) => void
  removeItem: (bookId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { books } = useCatalog()
  const [lines, dispatch] = useReducer(cartReducer, [], readGuestCart)
  const linesRef = useRef(lines)
  linesRef.current = lines

  useEffect(() => {
    if (!user) return

    let active = true
    void getUserCart(user.uid).then(async (remoteLines) => {
      if (!active) return
      const merged = mergeCartLines(remoteLines, linesRef.current)
      dispatch({ type: 'hydrate', lines: merged })
      localStorage.removeItem(GUEST_CART_KEY)
      await Promise.all(merged.map((line) => saveUserCartLine(user.uid, line)))
    })
    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!user) localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines))
  }, [lines, user, books])

  const value = useMemo<CartContextValue>(() => {
    const detailedLines = lines.flatMap((line) => {
      const book = books.find((item) => item.id === line.bookId)
      return book ? [{ book, quantity: line.quantity }] : []
    })
    return {
      lines,
      detailedLines,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      subtotal: detailedLines.reduce((total, line) => total + line.book.price * line.quantity, 0),
      addItem: (bookId, quantity = 1) => {
        dispatch({ type: 'add', bookId, quantity })
        if (user) {
          const current = lines.find((line) => line.bookId === bookId)?.quantity ?? 0
          void saveUserCartLine(user.uid, { bookId, quantity: current + quantity })
        }
      },
      updateQuantity: (bookId, quantity) => {
        const safeQuantity = Math.max(1, quantity)
        dispatch({ type: 'update', bookId, quantity: safeQuantity })
        if (user) void saveUserCartLine(user.uid, { bookId, quantity: safeQuantity })
      },
      removeItem: (bookId) => {
        dispatch({ type: 'remove', bookId })
        if (user) void removeUserCartLine(user.uid, bookId)
      },
      clearCart: () => {
        const ids = lines.map((line) => line.bookId)
        dispatch({ type: 'clear' })
        if (user) void Promise.all(ids.map((id) => removeUserCartLine(user.uid, id)))
      },
    }
  }, [lines, user, books])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// The provider and its companion hook intentionally share this small feature module.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
