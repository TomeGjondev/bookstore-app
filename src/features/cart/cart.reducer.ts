import type { CartLine } from './cart.types'

export type CartAction =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; bookId: string; quantity: number }
  | { type: 'update'; bookId: string; quantity: number }
  | { type: 'remove'; bookId: string }
  | { type: 'clear' }

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  if (action.type === 'hydrate') return action.lines
  if (action.type === 'clear') return []
  if (action.type === 'remove') return state.filter((line) => line.bookId !== action.bookId)
  if (action.type === 'update') return state.map((line) => line.bookId === action.bookId ? { ...line, quantity: action.quantity } : line)
  const existing = state.find((line) => line.bookId === action.bookId)
  if (existing) return state.map((line) => line.bookId === action.bookId ? { ...line, quantity: line.quantity + action.quantity } : line)
  return [...state, { bookId: action.bookId, quantity: action.quantity }]
}

export function mergeCartLines(remoteLines: CartLine[], guestLines: CartLine[]) {
  const merged = remoteLines.map((line) => ({ ...line }))
  for (const guestLine of guestLines) {
    const remote = merged.find((line) => line.bookId === guestLine.bookId)
    if (remote) remote.quantity = Math.max(remote.quantity, guestLine.quantity)
    else merged.push({ ...guestLine })
  }
  return merged
}
