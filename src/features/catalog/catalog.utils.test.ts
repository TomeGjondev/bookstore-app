import { describe, expect, it } from 'vitest'
import { books } from './catalog.data'
import { filterBooks, formatPrice } from './catalog.utils'

const baseFilters = { query: '', genre: '', format: '', price: '', inStock: false, sort: 'recommended' }

describe('filterBooks', () => {
  it('matches title, author, and genre without case sensitivity', () => {
    expect(filterBooks(books, { ...baseFilters, query: 'STARLIGHT' }).map((book) => book.slug)).toContain('a-study-in-starlight')
    expect(filterBooks(books, { ...baseFilters, query: 'iris wren' })).toHaveLength(1)
    expect(filterBooks(books, { ...baseFilters, query: 'poetry' }).every((book) => book.genre === 'Poetry')).toBe(true)
  })

  it('combines availability, genre, format, and price filters', () => {
    const results = filterBooks(books, { ...baseFilters, genre: 'Fiction', format: 'Paperback', price: '15-20', inStock: true })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((book) => book.genre === 'Fiction' && book.format === 'Paperback' && book.price >= 15 && book.price <= 20 && book.inStock)).toBe(true)
  })

  it('sorts by price, title, and publication year', () => {
    const ascending = filterBooks(books, { ...baseFilters, sort: 'price-asc' })
    expect(ascending[0].price).toBeLessThanOrEqual(ascending.at(-1)!.price)
    const titles = filterBooks(books, { ...baseFilters, sort: 'title' }).map((book) => book.title)
    expect(titles).toEqual([...titles].sort())
    const newest = filterBooks(books, { ...baseFilters, sort: 'newest' })
    expect(newest[0].publicationYear).toBeGreaterThanOrEqual(newest.at(-1)!.publicationYear)
  })
})

it('formats prices consistently', () => {
  expect(formatPrice(16.5)).toBe('$16.50')
})
