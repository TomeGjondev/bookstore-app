export type BookFormat = 'Hardcover' | 'Paperback'

export type CoverPalette =
  | 'amber'
  | 'river'
  | 'moss'
  | 'night'
  | 'plum'
  | 'terracotta'
  | 'sage'
  | 'ink'

export interface Book {
  id: string
  slug: string
  title: string
  author: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  format: BookFormat
  genre: string
  pageCount: number
  publisher: string
  publicationYear: number
  isbn: string
  inStock: boolean
  inventoryCount: number
  rating: number
  featured?: boolean
  newArrival?: boolean
  staffPick?: boolean
  staffNote?: string
  coverPalette: CoverPalette
  coverMark: string
}
