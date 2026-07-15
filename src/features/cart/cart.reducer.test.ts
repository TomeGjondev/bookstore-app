import { describe, expect, it } from 'vitest'
import { cartReducer, mergeCartLines } from './cart.reducer'

describe('cartReducer', () => {
  it('adds a new book and increments an existing quantity', () => {
    const first = cartReducer([], { type: 'add', bookId: 'book-a', quantity: 1 })
    expect(first).toEqual([{ bookId: 'book-a', quantity: 1 }])
    expect(cartReducer(first, { type: 'add', bookId: 'book-a', quantity: 2 })).toEqual([{ bookId: 'book-a', quantity: 3 }])
  })

  it('updates, removes, and clears lines without mutating prior state', () => {
    const original = [{ bookId: 'book-a', quantity: 2 }, { bookId: 'book-b', quantity: 1 }]
    const updated = cartReducer(original, { type: 'update', bookId: 'book-a', quantity: 4 })
    expect(updated[0].quantity).toBe(4)
    expect(original[0].quantity).toBe(2)
    expect(cartReducer(updated, { type: 'remove', bookId: 'book-b' })).toHaveLength(1)
    expect(cartReducer(updated, { type: 'clear' })).toEqual([])
  })
})

describe('mergeCartLines', () => {
  it('keeps the larger quantity for duplicates and includes unique guest books', () => {
    const merged = mergeCartLines(
      [{ bookId: 'shared', quantity: 2 }, { bookId: 'remote', quantity: 1 }],
      [{ bookId: 'shared', quantity: 4 }, { bookId: 'guest', quantity: 1 }],
    )
    expect(merged).toEqual([
      { bookId: 'shared', quantity: 4 },
      { bookId: 'remote', quantity: 1 },
      { bookId: 'guest', quantity: 1 },
    ])
  })
})
