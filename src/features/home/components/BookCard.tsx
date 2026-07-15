import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../cart/cart.context'
import { WishlistButton } from '../../wishlist/components/WishlistButton'

export interface FeaturedBook {
  id: string
  slug: string
  title: string
  author: string
  price: string
  palette: string
  label?: string
  mark: string
}

export function BookCard({ book }: { book: FeaturedBook }) {
  const { addItem } = useCart()
  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        {book.label && <span className="book-label">{book.label}</span>}
        <WishlistButton bookId={book.id} title={book.title} />
        <Link to={`/books/${book.slug}`} className={`book-cover ${book.palette}`}>
          <span className="cover-mark" aria-hidden="true">{book.mark}</span>
          <span className="cover-title">{book.title}</span>
          <span className="cover-author">{book.author}</span>
        </Link>
      </div>
      <div className="book-meta">
        <div><Link to={`/books/${book.slug}`}><h3>{book.title}</h3></Link><p>{book.author}</p></div>
        <div className="book-buy"><span>{book.price}</span><button type="button" aria-label={`Add ${book.title} to bag`} onClick={() => addItem(book.id)}><Plus size={17} /></button></div>
      </div>
    </article>
  )
}
