import type { Book } from '../catalog.types'

interface BookCoverProps {
  book: Book
  size?: 'small' | 'regular' | 'large'
}

export function BookCover({ book, size = 'regular' }: BookCoverProps) {
  if (book.coverUrl) {
    return (
      <div className={`catalog-cover cover-${size} has-image`}>
        <img src={book.coverUrl} alt={`Cover of ${book.title} by ${book.author}`} />
      </div>
    )
  }
  return (
    <div className={`catalog-cover cover-${book.coverPalette} cover-${size}`} aria-label={`Cover of ${book.title}`} role="img">
      <span className="catalog-cover-mark" aria-hidden="true">{book.coverMark}</span>
      <strong>{book.title}</strong>
      <small>{book.author}</small>
    </div>
  )
}
