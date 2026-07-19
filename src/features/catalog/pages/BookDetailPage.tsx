import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice } from '../catalog.utils'
import { BookCover } from '../components/BookCover'
import { CatalogBookCard } from '../components/CatalogBookCard'
import { useCart } from '../../cart/cart.context'
import { WishlistButton } from '../../wishlist/components/WishlistButton'
import { useCatalog } from '../catalog.context'

export function BookDetailPage() {
  const { slug } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { books, loading, error, refresh } = useCatalog()
  const book = books.find((item) => item.slug === slug)
  const related = useMemo(() => books.filter((item) => item.genre === book?.genre && item.id !== book?.id).slice(0, 3), [book, books])

  if (!book && loading) {
    return <main id="main-content" className="book-not-found page-shell"><span className="book-loader" /><h1>Reading the shelves…</h1></main>
  }

  if (!book && error) {
    return <main id="main-content" className="book-not-found page-shell" role="alert"><span aria-hidden="true">⌇</span><h1>The shelves are temporarily unavailable.</h1><p>{error}</p><button className="button button-ink" type="button" onClick={() => void refresh()}>Try again</button></main>
  }

  if (!book) {
    return (
      <main id="main-content" className="book-not-found page-shell">
        <span aria-hidden="true">?</span><p className="eyebrow">A missing volume</p><h1>That book isn’t on our shelves.</h1><Link className="button button-ink" to="/books"><ArrowLeft size={17} /> Return to the catalog</Link>
      </main>
    )
  }

  return (
    <main id="main-content" className="book-detail-page">
      <div className="page-shell book-breadcrumb"><Link to="/books"><ArrowLeft size={15} /> All books</Link><span>/</span><Link to={`/books?genre=${encodeURIComponent(book.genre)}`}>{book.genre}</Link><span>/</span><span>{book.title}</span></div>
      <section className="page-shell book-detail-grid">
        <div className="detail-cover-stage">
          {book.staffPick && <div className="detail-staff-tag">Picked by us</div>}
          <BookCover book={book} size="large" />
          <span className="cover-shadow" aria-hidden="true" />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{book.genre} <span>·</span> {book.format}</p>
          <h1>{book.title}</h1>
          <p className="detail-author">by <strong>{book.author}</strong></p>
          <div className="detail-rating"><span><Star size={15} fill="currentColor" /> {book.rating}</span><span>Bookseller rating</span></div>
          <p className="detail-description">{book.description}</p>
          {book.staffNote && <blockquote className="staff-note"><span>From the recommendation shelf</span><p>“{book.staffNote}”</p><small>— Mara, bookseller</small></blockquote>}
          <div className="purchase-panel">
            <div className="detail-price"><strong>{formatPrice(book.price)}</strong>{book.compareAtPrice && <del>{formatPrice(book.compareAtPrice)}</del>}</div>
            <p className={book.inStock ? 'availability in-stock' : 'availability'}><span />{book.inStock ? `In stock — ${book.inventoryCount} copies in the shop` : 'Temporarily out of stock'}</p>
            <div className="purchase-controls">
              <div className="quantity-control" aria-label="Quantity"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity === 1} aria-label="Decrease quantity"><Minus size={16} /></button><span aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(book.inventoryCount || 1, quantity + 1))} disabled={!book.inStock || quantity >= book.inventoryCount} aria-label="Increase quantity"><Plus size={16} /></button></div>
              <button className="button add-bag-button" type="button" disabled={!book.inStock} onClick={() => { addItem(book.id, quantity); setAdded(true) }}>{added ? <><Check size={18} /> Added to your bag</> : <><ShoppingBag size={18} /> Add to book bag</>}</button>
              <WishlistButton bookId={book.id} title={book.title} className="detail-heart" />
            </div>
            <div className="purchase-assurances"><span><Truck size={17} /> Free local delivery over $35</span><span><ShieldCheck size={17} /> Carefully wrapped in recyclable paper</span></div>
          </div>
        </div>
      </section>

      <section className="book-facts">
        <div className="page-shell facts-grid">
          <div><span>Format</span><strong>{book.format}</strong></div><div><span>Pages</span><strong>{book.pageCount}</strong></div><div><span>Published</span><strong>{book.publicationYear}</strong></div><div><span>Publisher</span><strong>{book.publisher}</strong></div><div><span>ISBN</span><strong>{book.isbn}</strong></div>
        </div>
      </section>

      {related.length > 0 && <section className="section page-shell related-books"><div className="section-heading compact"><div><p className="eyebrow">Keep wandering</p><h2>More from this <em>shelf</em></h2></div><Link className="text-link" to={`/books?genre=${encodeURIComponent(book.genre)}`}>See all {book.genre.toLowerCase()}</Link></div><div className="catalog-grid related-grid">{related.map((item) => <CatalogBookCard key={item.id} book={item} />)}</div></section>}
    </main>
  )
}
