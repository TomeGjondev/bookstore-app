import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { books as seedBooks } from './catalog.data'
import { getActiveBooks } from './catalog.service'
import type { Book } from './catalog.types'

interface CatalogContextValue {
  books: Book[]
  genres: string[]
  loading: boolean
  usingDevelopmentData: boolean
  refresh: () => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState(seedBooks)
  const [loading, setLoading] = useState(true)
  const [usingDevelopmentData, setUsingDevelopmentData] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const remoteBooks = await getActiveBooks()
      if (remoteBooks) {
        setBooks(remoteBooks)
        setUsingDevelopmentData(false)
      } else {
        setBooks(seedBooks)
        setUsingDevelopmentData(true)
      }
    } catch {
      setBooks(seedBooks)
      setUsingDevelopmentData(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const value = useMemo(() => ({
    books,
    genres: [...new Set(books.map((book) => book.genre))],
    loading,
    usingDevelopmentData,
    refresh,
  }), [books, loading, usingDevelopmentData, refresh])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// The provider and its companion hook intentionally share this feature module.
// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog must be used within CatalogProvider')
  return context
}
