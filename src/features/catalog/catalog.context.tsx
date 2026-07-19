import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { books as seedBooks } from './catalog.data'
import { getActiveBooks } from './catalog.service'
import type { Book } from './catalog.types'

interface CatalogContextValue {
  books: Book[]
  genres: string[]
  loading: boolean
  error: string
  usingDevelopmentData: boolean
  refresh: () => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState(import.meta.env.DEV ? seedBooks : [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [usingDevelopmentData, setUsingDevelopmentData] = useState(import.meta.env.DEV)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const remoteBooks = await getActiveBooks()
      if (remoteBooks !== null) {
        setBooks(remoteBooks)
        setUsingDevelopmentData(false)
      } else if (import.meta.env.DEV) {
        setBooks(seedBooks)
        setUsingDevelopmentData(true)
      } else {
        setBooks([])
        setUsingDevelopmentData(false)
        setError('The catalog is not connected. Please try again later.')
      }
    } catch {
      if (import.meta.env.DEV) {
        setBooks(seedBooks)
        setUsingDevelopmentData(true)
      } else {
        setBooks([])
        setUsingDevelopmentData(false)
        setError('We could not reach the catalog. Please try again in a moment.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const value = useMemo(() => ({
    books,
    genres: [...new Set(books.map((book) => book.genre))],
    loading,
    error,
    usingDevelopmentData,
    refresh,
  }), [books, loading, error, usingDevelopmentData, refresh])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// The provider and its companion hook intentionally share this feature module.
// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog must be used within CatalogProvider')
  return context
}
