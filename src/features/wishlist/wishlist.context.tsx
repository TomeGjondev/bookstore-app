import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/auth.context'
import { getWishlist, removeWishlistBook, saveWishlistBook } from './wishlist.service'

interface WishlistContextValue {
  bookIds: string[]
  loading: boolean
  hasBook: (bookId: string) => boolean
  toggleBook: (bookId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [bookIds, setBookIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setBookIds([])
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    void getWishlist(user.uid).then(async (ids) => {
      const pendingBookId = sessionStorage.getItem('lantern-and-leaf-wishlist-intent')
      if (pendingBookId && !ids.includes(pendingBookId)) {
        ids.push(pendingBookId)
        await saveWishlistBook(user.uid, pendingBookId)
      }
      sessionStorage.removeItem('lantern-and-leaf-wishlist-intent')
      if (active) setBookIds(ids)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [user])

  const value = useMemo<WishlistContextValue>(() => ({
    bookIds,
    loading,
    hasBook: (bookId) => bookIds.includes(bookId),
    toggleBook: async (bookId) => {
      if (!user) return
      const saved = bookIds.includes(bookId)
      setBookIds((current) => saved ? current.filter((id) => id !== bookId) : [...current, bookId])
      try {
        if (saved) await removeWishlistBook(user.uid, bookId)
        else await saveWishlistBook(user.uid, bookId)
      } catch (error) {
        setBookIds((current) => saved ? [...current, bookId] : current.filter((id) => id !== bookId))
        throw error
      }
    },
  }), [bookIds, loading, user])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// The provider and its companion hook intentionally share this feature module.
// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
