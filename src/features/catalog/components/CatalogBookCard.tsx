import { Heart, Plus, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../catalog.types'
import { formatPrice } from '../catalog.utils'
import { BookCover } from './BookCover'

export function CatalogBookCard({ book }: { book: Book }) {
  return (
    <article className="catalog-card">
      <div className="catalog-card-visual">
        {book.staffPick && <span className="catalog-ribbon">Staff pick</span>}
        <button className="favorite-button" type="button" aria-label={`Save ${book.title} to your wishlist`}><Heart size={18} /></button>
        <Link to={`/books/${book.slug}`} aria-label={`View ${book.title}`}><BookCover book={book} /></Link>
      </div>
      <div className="catalog-card-copy">
        <div className="catalog-card-kicker"><span>{book.genre}</span><span><Star size={11} fill="currentColor" /> {book.rating}</span></div>
        <Link to={`/books/${book.slug}`}><h2>{book.title}</h2></Link>
        <p>{book.author}</p>
        <div className="catalog-card-bottom">
          <div><strong>{formatPrice(book.price)}</strong><small>{book.format}</small></div>
          <button type="button" aria-label={`Add ${book.title} to bag`} disabled={!book.inStock}><Plus size={18} /></button>
        </div>
        {!book.inStock && <span className="stock-note">Back soon</span>}
      </div>
    </article>
  )
}
