import { Plus, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../catalog.types'
import { formatPrice } from '../catalog.utils'
import { BookCover } from './BookCover'
import { useCart } from '../../cart/cart.context'
import { WishlistButton } from '../../wishlist/components/WishlistButton'

export function CatalogBookCard({ book }: { book: Book }) {
  const { addItem } = useCart()
  return (
    <article className="catalog-card">
      <div className="catalog-card-visual">
        {book.staffPick && <span className="catalog-ribbon">Staff pick</span>}
        <WishlistButton bookId={book.id} title={book.title} />
        <Link to={`/books/${book.slug}`} aria-label={`View ${book.title}`}><BookCover book={book} /></Link>
      </div>
      <div className="catalog-card-copy">
        <div className="catalog-card-kicker"><span>{book.genre}</span><span><Star size={11} fill="currentColor" /> {book.rating}</span></div>
        <Link to={`/books/${book.slug}`}><h2>{book.title}</h2></Link>
        <p>{book.author}</p>
        <div className="catalog-card-bottom">
          <div><strong>{formatPrice(book.price)}</strong><small>{book.format}</small></div>
          <button type="button" aria-label={`Add ${book.title} to bag`} disabled={!book.inStock} onClick={() => addItem(book.id)}><Plus size={18} /></button>
        </div>
        {!book.inStock && <span className="stock-note">Back soon</span>}
      </div>
    </article>
  )
}
