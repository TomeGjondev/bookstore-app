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
  const activeUserIdRef = useRef<string | null>(null)
  linesRef.current = lines

  useEffect(() => {
    if (!user) {
      if (activeUserIdRef.current) {
        activeUserIdRef.current = null
        const guestLines = readGuestCart()
        linesRef.current = guestLines
        dispatch({ type: 'hydrate', lines: guestLines })
      }
      return
    }

    const previousUserId = activeUserIdRef.current
    activeUserIdRef.current = user.uid
    if (previousUserId && previousUserId !== user.uid) {
      linesRef.current = []
      dispatch({ type: 'hydrate', lines: [] })
    }

    let active = true
    void getUserCart(user.uid).then(async (remoteLines) => {
      if (!active || activeUserIdRef.current !== user.uid) return
      const merged = mergeCartLines(remoteLines, linesRef.current)
      linesRef.current = merged
      dispatch({ type: 'hydrate', lines: merged })
      localStorage.removeItem(GUEST_CART_KEY)
      await Promise.all(merged.map((line) => saveUserCartLine(user.uid, line)))
    }).catch(() => undefined)
    return () => { active = false }
  }, [user])

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
        const action = { type: 'add' as const, bookId, quantity }
        const nextLines = cartReducer(linesRef.current, action)
        linesRef.current = nextLines
        dispatch(action)
        if (user) {
          const nextQuantity = nextLines.find((line) => line.bookId === bookId)?.quantity ?? quantity
          void saveUserCartLine(user.uid, { bookId, quantity: nextQuantity }).catch(() => undefined)
        } else localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextLines))
      },
      updateQuantity: (bookId, quantity) => {
        const safeQuantity = Math.max(1, quantity)
        const action = { type: 'update' as const, bookId, quantity: safeQuantity }
        const nextLines = cartReducer(linesRef.current, action)
        linesRef.current = nextLines
        dispatch(action)
        if (user) void saveUserCartLine(user.uid, { bookId, quantity: safeQuantity }).catch(() => undefined)
        else localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextLines))
      },
      removeItem: (bookId) => {
        const action = { type: 'remove' as const, bookId }
        const nextLines = cartReducer(linesRef.current, action)
        linesRef.current = nextLines
        dispatch(action)
        if (user) void removeUserCartLine(user.uid, bookId).catch(() => undefined)
        else localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextLines))
      },
      clearCart: () => {
        const ids = linesRef.current.map((line) => line.bookId)
        linesRef.current = []
        dispatch({ type: 'clear' })
        if (user) void Promise.all(ids.map((id) => removeUserCartLine(user.uid, id))).catch(() => undefined)
        else localStorage.setItem(GUEST_CART_KEY, '[]')
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
