import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BookCover } from '../../catalog/components/BookCover'
import { formatPrice } from '../../catalog/catalog.utils'
import { useCart } from '../cart.context'

const FREE_DELIVERY_AT = 35

export function CartPage() {
  const { detailedLines, itemCount, subtotal, updateQuantity, removeItem } = useCart()
  const remaining = Math.max(0, FREE_DELIVERY_AT - subtotal)

  if (detailedLines.length === 0) {
    return (
      <main id="main-content" className="empty-cart page-shell">
        <div className="empty-bag-mark"><ShoppingBag size={38} strokeWidth={1.3} /><span>0</span></div>
        <p className="eyebrow">A quiet book bag</p>
        <h1>There’s room for a story.</h1>
        <p>Your bag is empty for now. Wander the shelves—we’ve left a few recommendations waiting for you.</p>
        <Link className="button button-ink" to="/books">Browse the shelves <ArrowRight size={17} /></Link>
      </main>
    )
  }

  return (
    <main id="main-content" className="cart-page">
      <section className="cart-heading page-shell"><div><p className="eyebrow">Your next reading stack</p><h1>Your book bag</h1></div><p>{itemCount} {itemCount === 1 ? 'book' : 'books'} chosen with care</p></section>
      <section className="page-shell cart-layout">
        <div className="cart-lines">
          {detailedLines.map(({ book, quantity }) => (
            <article className="cart-line" key={book.id}>
              <Link className="cart-cover" to={`/books/${book.slug}`}><BookCover book={book} size="small" /></Link>
              <div className="cart-line-copy">
                <p>{book.genre} · {book.format}</p>
                <Link to={`/books/${book.slug}`}><h2>{book.title}</h2></Link>
                <span>by {book.author}</span>
                <div className="cart-line-mobile-price">{formatPrice(book.price)}</div>
                <div className="cart-line-actions">
                  <div className="quantity-control" aria-label={`Quantity of ${book.title}`}><button type="button" disabled={quantity === 1} onClick={() => updateQuantity(book.id, quantity - 1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button type="button" disabled={quantity >= book.inventoryCount} onClick={() => updateQuantity(book.id, quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div>
                  <button type="button" className="remove-line" onClick={() => removeItem(book.id)}><Trash2 size={14} /> Remove</button>
                </div>
              </div>
              <strong className="cart-line-price">{formatPrice(book.price * quantity)}</strong>
            </article>
          ))}
          <div className="cart-care-note"><span aria-hidden="true">❦</span><p>Every order is wrapped by hand in recyclable paper, with a bookmark tucked inside.</p></div>
        </div>
        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="delivery-progress">
            <p><Truck size={17} /> {remaining > 0 ? <><strong>{formatPrice(remaining)}</strong> away from free local delivery</> : <strong>You’ve unlocked free local delivery</strong>}</p>
            <div><span style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100)}%` }} /></div>
          </div>
          <dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Delivery</dt><dd>{subtotal >= FREE_DELIVERY_AT ? 'Free' : 'Calculated next'}</dd></div></dl>
          <div className="summary-total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div>
          <button className="button checkout-button" type="button">Continue to checkout <ArrowRight size={17} /></button>
          <p>Checkout will be added in a later chapter. Your bag is safely kept on this device.</p>
          <Link className="text-link" to="/books">Keep browsing</Link>
        </aside>
      </section>
    </main>
  )
}
