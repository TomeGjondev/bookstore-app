import { ArrowRight, BookHeart, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CatalogBookCard } from '../../catalog/components/CatalogBookCard'
import { useWishlist } from '../wishlist.context'
import { useCatalog } from '../../catalog/catalog.context'

export function WishlistPage() {
  const { bookIds, loading } = useWishlist()
  const { books } = useCatalog()
  const savedBooks = books.filter((book) => bookIds.includes(book.id))

  return (
    <main id="main-content" className="wishlist-page">
      <section className="wishlist-hero"><div className="page-shell"><div><p className="eyebrow light">Books worth remembering</p><h1>Your <em>wishlist</em></h1><p>A quiet shelf for discoveries you would like to return to.</p></div><div className="wishlist-seal" aria-hidden="true"><BookHeart size={31} /><span>{savedBooks.length}</span></div></div></section>
      <section className="page-shell wishlist-content">
        {loading ? <div className="wishlist-loading"><span className="book-loader" /><p>Gathering your saved stories…</p></div> : savedBooks.length > 0 ? <><div className="wishlist-toolbar"><p><strong>{savedBooks.length}</strong> {savedBooks.length === 1 ? 'book is' : 'books are'} waiting for you</p><Link className="text-link" to="/books">Find another <ArrowRight size={15} /></Link></div><div className="catalog-grid wishlist-grid">{savedBooks.map((book) => <CatalogBookCard key={book.id} book={book} />)}</div></> : <div className="wishlist-empty"><div><Heart size={36} strokeWidth={1.3} /></div><p className="eyebrow">Nothing tucked away yet</p><h2>Save a book for later.</h2><p>Tap the heart beside any book and it will wait for you here—no folded page corners required.</p><Link className="button button-ink" to="/books">Wander the shelves <ArrowRight size={16} /></Link></div>}
      </section>
    </main>
  )
}
