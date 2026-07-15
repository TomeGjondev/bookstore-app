import type { Book } from './catalog.types'

export const formatPrice = (price: number) => `$${price.toFixed(2)}`

export function filterBooks(
  books: Book[],
  filters: { query: string; genre: string; format: string; price: string; inStock: boolean; sort: string },
) {
  const query = filters.query.trim().toLowerCase()
  const filtered = books.filter((book) => {
    const matchesQuery = !query || `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query)
    const matchesGenre = !filters.genre || book.genre.toLowerCase() === filters.genre.toLowerCase()
    const matchesFormat = !filters.format || book.format.toLowerCase() === filters.format.toLowerCase()
    const matchesPrice = !filters.price
      || (filters.price === 'under-15' && book.price < 15)
      || (filters.price === '15-20' && book.price >= 15 && book.price <= 20)
      || (filters.price === 'over-20' && book.price > 20)
    return matchesQuery && matchesGenre && matchesFormat && matchesPrice && (!filters.inStock || book.inStock)
  })

  return [...filtered].sort((a, b) => {
    if (filters.sort === 'price-asc') return a.price - b.price
    if (filters.sort === 'price-desc') return b.price - a.price
    if (filters.sort === 'title') return a.title.localeCompare(b.title)
    if (filters.sort === 'newest') return b.publicationYear - a.publicationYear
    return Number(b.staffPick) - Number(a.staffPick) || b.rating - a.rating
  })
}
