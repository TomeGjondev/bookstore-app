import { Heart, Plus } from 'lucide-react'

export interface FeaturedBook {
  title: string
  author: string
  price: string
  palette: string
  label?: string
  mark: string
}

export function BookCard({ book }: { book: FeaturedBook }) {
  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        {book.label && <span className="book-label">{book.label}</span>}
        <button type="button" className="favorite-button" aria-label={`Add ${book.title} to wishlist`}><Heart size={18} /></button>
        <div className={`book-cover ${book.palette}`}>
          <span className="cover-mark" aria-hidden="true">{book.mark}</span>
          <span className="cover-title">{book.title}</span>
          <span className="cover-author">{book.author}</span>
        </div>
      </div>
      <div className="book-meta">
        <div><h3>{book.title}</h3><p>{book.author}</p></div>
        <div className="book-buy"><span>{book.price}</span><button type="button" aria-label={`Add ${book.title} to bag`}><Plus size={17} /></button></div>
      </div>
    </article>
  )
}
