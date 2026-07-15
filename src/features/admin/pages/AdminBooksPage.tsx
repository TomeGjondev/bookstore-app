import { useCallback, useEffect, useMemo, useState } from 'react'
import { Archive, Edit3, Minus, PackagePlus, Plus, RotateCcw, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import type { Book, BookStatus } from '../../catalog/catalog.types'
import { formatPrice } from '../../catalog/catalog.utils'
import { getAdminBooks, seedDevelopmentCatalog, setBookStatus, updateBookInventory } from '../admin.service'
import { useFocusTrap } from '../../../hooks/useFocusTrap'

export function AdminBooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | BookStatus>('all')
  const [loading, setLoading] = useState(true)
  const [archiveTarget, setArchiveTarget] = useState<Book | null>(null)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const [inventoryTarget, setInventoryTarget] = useState<Book | null>(null)
  const [inventoryValue, setInventoryValue] = useState(0)
  const closeDialogs = useCallback(() => {
    setArchiveTarget(null)
    setInventoryTarget(null)
  }, [])
  const dialogRef = useFocusTrap(Boolean(archiveTarget || inventoryTarget), closeDialogs)

  const loadBooks = () => getAdminBooks().then(setBooks).finally(() => setLoading(false))
  useEffect(() => { void loadBooks() }, [])

  const results = useMemo(() => books.filter((book) => {
    const matchesQuery = !query || `${book.title} ${book.author} ${book.isbn}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'all' || (book.status ?? 'active') === status)
  }), [books, query, status])

  const archiveBook = async () => {
    if (!archiveTarget || !user) return
    setError('')
    try {
      await setBookStatus(archiveTarget.id, 'archived', user.uid)
      setBooks((current) => current.map((book) => book.id === archiveTarget.id ? { ...book, status: 'archived' } : book))
      setArchiveTarget(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The book could not be archived.')
      setArchiveTarget(null)
    }
  }

  const importStarterBooks = async () => {
    if (!user) return
    setImporting(true)
    setError('')
    try {
      await seedDevelopmentCatalog(user.uid)
      await loadBooks()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The starter catalog could not be imported.')
    } finally {
      setImporting(false)
    }
  }

  const restoreBook = async (book: Book) => {
    if (!user) return
    setError('')
    try {
      await setBookStatus(book.id, 'active', user.uid)
      setBooks((current) => current.map((item) => item.id === book.id ? { ...item, status: 'active' } : item))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The book could not be restored.')
    }
  }

  const saveInventory = async () => {
    if (!inventoryTarget || !user) return
    const safeCount = Math.max(0, Math.floor(inventoryValue))
    setError('')
    try {
      await updateBookInventory(inventoryTarget.id, safeCount, user.uid)
      setBooks((current) => current.map((book) => book.id === inventoryTarget.id ? { ...book, inventoryCount: safeCount, inStock: safeCount > 0 } : book))
      setInventoryTarget(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Inventory could not be updated.')
      setInventoryTarget(null)
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-page-heading"><div><p className="admin-eyebrow">Catalog</p><h1>Books</h1><p>Arrange what appears on the shelves, keep stock accurate, and prepare new arrivals.</p></div><Link className="admin-primary-button" to="/admin/books/new"><Plus size={17} /> Add a new book</Link></header>
      <section className="admin-table-panel">
        <div className="admin-table-toolbar"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, author, or ISBN" aria-label="Search books" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</label><div role="group" aria-label="Filter by status">{(['all', 'active', 'draft', 'archived'] as const).map((value) => <button className={status === value ? 'active' : ''} type="button" key={value} onClick={() => setStatus(value)}>{value === 'all' ? 'All books' : value}</button>)}</div></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {loading ? <div className="admin-loading">Reading the catalog…</div> : results.length ? <div className="admin-table-wrap"><table className="admin-book-table"><thead><tr><th>Book</th><th>Status</th><th>Stock</th><th>Price</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{results.map((book) => { const bookStatus = book.status ?? 'active'; return <tr key={book.id}><td><div className={`admin-mini-cover cover-${book.coverPalette}`}>{book.coverUrl ? <img src={book.coverUrl} alt="" /> : book.coverMark}</div><span><strong>{book.title}</strong><small>{book.author} · {book.format}</small></span></td><td><span className={`admin-status ${bookStatus}`}>{bookStatus}</span></td><td><button className="stock-edit-button" type="button" onClick={() => { setInventoryTarget(book); setInventoryValue(book.inventoryCount) }} aria-label={`Adjust inventory for ${book.title}`}><span><strong className={book.inventoryCount === 0 ? 'stock-empty' : book.inventoryCount <= 3 ? 'stock-low' : ''}>{book.inventoryCount}</strong><small>{book.inventoryCount === 1 ? 'copy' : 'copies'}</small></span><PackagePlus size={14} /></button></td><td>{formatPrice(book.price)}</td><td><span className="admin-muted">Recently</span></td><td><Link to={`/admin/books/${book.id}/edit`} aria-label={`Edit ${book.title}`}><Edit3 size={16} /></Link>{bookStatus === 'archived' ? <button type="button" onClick={() => void restoreBook(book)} aria-label={`Restore ${book.title}`}><RotateCcw size={16} /></button> : <button type="button" onClick={() => setArchiveTarget(book)} aria-label={`Archive ${book.title}`}><Archive size={16} /></button>}</td></tr>})}</tbody></table></div> : <div className="admin-table-empty"><p>{books.length ? 'No books match this corner of the catalog.' : 'The Firestore catalog is ready for its first shelf.'}</p>{books.length ? <button type="button" onClick={() => { setQuery(''); setStatus('all') }}>Clear filters</button> : <button type="button" disabled={importing} onClick={() => void importStarterBooks()}>{importing ? 'Importing…' : 'Import starter books'}</button>}</div>}
        <footer className="admin-table-footer"><span>Showing {results.length} of {books.length} books</span></footer>
      </section>
      {archiveTarget && <div className="admin-dialog-backdrop" role="presentation"><div ref={dialogRef} className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="archive-title"><button className="admin-dialog-close" type="button" onClick={() => setArchiveTarget(null)} aria-label="Close"><X size={18} /></button><Archive size={28} /><p className="admin-eyebrow">Move from the public shelves</p><h2 id="archive-title">Archive “{archiveTarget.title}”?</h2><p>The book will disappear from the shop but stay safely in the catalog so it can be restored later.</p><div><button type="button" onClick={() => setArchiveTarget(null)}>Keep published</button><button type="button" onClick={() => void archiveBook()}>Archive book</button></div></div></div>}
      {inventoryTarget && <div className="admin-dialog-backdrop" role="presentation"><div ref={dialogRef} className="admin-dialog inventory-dialog" role="dialog" aria-modal="true" aria-labelledby="inventory-title"><button className="admin-dialog-close" type="button" onClick={() => setInventoryTarget(null)} aria-label="Close"><X size={18} /></button><PackagePlus size={28} /><p className="admin-eyebrow">Quick shelf count</p><h2 id="inventory-title">Update “{inventoryTarget.title}”</h2><p>Set the number of copies currently available in the shop.</p><div className="inventory-stepper"><button type="button" onClick={() => setInventoryValue(Math.max(0, inventoryValue - 1))} aria-label="Decrease inventory"><Minus size={17} /></button><input type="number" min="0" value={inventoryValue} onChange={(event) => setInventoryValue(Math.max(0, Number(event.target.value)))} aria-label="Inventory count" /><button type="button" onClick={() => setInventoryValue(inventoryValue + 1)} aria-label="Increase inventory"><Plus size={17} /></button></div><div><button type="button" onClick={() => setInventoryTarget(null)}>Cancel</button><button type="button" onClick={() => void saveInventory()}>Save count</button></div></div></div>}
    </main>
  )
}
