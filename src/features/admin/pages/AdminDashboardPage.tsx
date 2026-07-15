import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookCheck, BookOpen, CircleDollarSign, PackageOpen, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../../catalog/catalog.types'
import { formatPrice } from '../../catalog/catalog.utils'
import { getAdminBooks } from '../admin.service'

export function AdminDashboardPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { void getAdminBooks().then(setBooks).finally(() => setLoading(false)) }, [])

  const metrics = useMemo(() => ({
    active: books.filter((book) => (book.status ?? 'active') === 'active').length,
    lowStock: books.filter((book) => book.inventoryCount > 0 && book.inventoryCount <= 3).length,
    outOfStock: books.filter((book) => book.inventoryCount === 0).length,
    inventoryValue: books.reduce((total, book) => total + book.price * book.inventoryCount, 0),
  }), [books])
  const attention = books.filter((book) => book.inventoryCount <= 3).slice(0, 5)

  return (
    <main className="admin-page">
      <header className="admin-page-heading"><div><p className="admin-eyebrow">Wednesday, 15 July</p><h1>Good morning, bookseller.</h1><p>Here’s what’s happening around the shelves today.</p></div><Link className="admin-primary-button" to="/admin/books/new"><Plus size={17} /> Add a new book</Link></header>
      {loading ? <div className="admin-loading">Opening the daybook…</div> : <>
        <section className="admin-metrics" aria-label="Catalog overview">
          <article><span><BookOpen size={19} /></span><div><small>Published books</small><strong>{metrics.active}</strong><p>Visible in the shop</p></div></article>
          <article><span><PackageOpen size={19} /></span><div><small>Low stock</small><strong>{metrics.lowStock}</strong><p>Three copies or fewer</p></div></article>
          <article><span><BookCheck size={19} /></span><div><small>Out of stock</small><strong>{metrics.outOfStock}</strong><p>Need a restock</p></div></article>
          <article><span><CircleDollarSign size={19} /></span><div><small>Inventory value</small><strong>{formatPrice(metrics.inventoryValue)}</strong><p>At current prices</p></div></article>
        </section>
        <div className="admin-dashboard-grid">
          <section className="admin-panel attention-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Worth a look</p><h2>Shelf attention</h2></div><Link to="/admin/books">View all <ArrowRight size={14} /></Link></div>{attention.length ? <div className="attention-list">{attention.map((book) => <Link to={`/admin/books/${book.id}/edit`} key={book.id}><div className={`attention-cover cover-${book.coverPalette}`}>{book.coverMark}</div><span><strong>{book.title}</strong><small>{book.author}</small></span><em className={book.inventoryCount === 0 ? 'empty' : ''}>{book.inventoryCount === 0 ? 'Out' : `${book.inventoryCount} left`}</em></Link>)}</div> : <p className="admin-panel-empty">Every shelf is comfortably stocked.</p>}</section>
          <aside className="admin-panel admin-note"><Sparkles size={22} /><p className="admin-eyebrow">Bookseller note</p><blockquote>“A tidy catalog leaves more time for talking about books.”</blockquote><span>— The daybook</span><Link to="/admin/books">Manage the shelves <ArrowRight size={14} /></Link></aside>
        </div>
      </>}
    </main>
  )
}
