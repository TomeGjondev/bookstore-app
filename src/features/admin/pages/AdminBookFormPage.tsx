import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, ImagePlus, Save, X } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import { useCatalog } from '../../catalog/catalog.context'
import type { Book, BookFormat, BookStatus, CoverPalette } from '../../catalog/catalog.types'
import { BookCover } from '../../catalog/components/BookCover'
import { getAdminBooks, saveBook } from '../admin.service'
import { uploadBookCover, validateCoverFile } from '../cover-upload.service'

const palettes: CoverPalette[] = ['amber', 'river', 'moss', 'night', 'plum', 'terracotta', 'sage', 'ink']

const emptyBook: Book = {
  id: '', slug: '', title: '', author: '', description: '', shortDescription: '', price: 18,
  format: 'Paperback', genre: 'Fiction', pageCount: 280, publisher: '', publicationYear: new Date().getFullYear(),
  isbn: '', inStock: true, inventoryCount: 5, rating: 4.5, coverPalette: 'moss', coverMark: '✦', status: 'draft',
}

const createSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function AdminBookFormPage() {
  const { bookId } = useParams()
  const { user } = useAuth()
  const { refresh } = useCatalog()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book>(emptyBook)
  const [loading, setLoading] = useState(Boolean(bookId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const isEditing = Boolean(bookId)

  useEffect(() => {
    if (!bookId) return
    void getAdminBooks().then((items) => {
      const match = items.find((item) => item.id === bookId)
      if (match) setBook({ ...emptyBook, ...match })
      else setError('That catalog record could not be found.')
    }).finally(() => setLoading(false))
  }, [bookId])

  const update = <K extends keyof Book>(key: K, value: Book[K]) => setBook((current) => ({ ...current, [key]: value }))

  useEffect(() => () => {
    if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview)
  }, [coverPreview])

  const chooseCover = (file?: File) => {
    if (!file) return
    const validationError = validateCoverFile(file)
    if (validationError) return setError(validationError)
    setError('')
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: FormEvent, statusOverride?: BookStatus) => {
    event.preventDefault()
    if (!user) return setError('Connect Firebase and sign in with an administrator account before saving changes.')
    if (!book.title.trim() || !book.author.trim() || !book.description.trim()) return setError('Title, author, and description are required.')
    if (book.price <= 0 || book.inventoryCount < 0) return setError('Price and inventory must use sensible positive values.')
    setSaving(true)
    setError('')
    try {
      const status = statusOverride ?? book.status ?? 'draft'
      const slug = book.slug || createSlug(book.title)
      let bookToSave = { ...book, slug, status, inStock: book.inventoryCount > 0 }
      if (coverFile) {
        const uploadedCover = await uploadBookCover(coverFile, book.id || slug, setUploadProgress)
        bookToSave = { ...bookToSave, ...uploadedCover }
      }
      await saveBook(bookToSave, user.uid)
      await refresh()
      navigate('/admin/books', { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The book could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="admin-page"><div className="admin-loading">Finding that book in the daybook…</div></main>

  return (
    <main className="admin-page admin-book-form-page">
      <header className="admin-form-heading"><div><Link to="/admin/books"><ArrowLeft size={15} /> Back to books</Link><p className="admin-eyebrow">{isEditing ? 'Edit catalog record' : 'New catalog record'}</p><h1>{isEditing ? book.title || 'Edit book' : 'Add a new book'}</h1><p>{isEditing ? 'Adjust the details readers see and keep the shelf information accurate.' : 'Give the new arrival everything it needs before placing it on the public shelves.'}</p></div><span className={`admin-status ${book.status ?? 'draft'}`}>{book.status ?? 'draft'}</span></header>
      <form className="admin-book-form" onSubmit={(event) => void handleSubmit(event)}>
        <div className="admin-form-main">
          {error && <p className="admin-error" role="alert">{error}</p>}
          <fieldset><legend>Book information</legend><div className="admin-form-grid"><label className="span-two"><span>Title</span><input value={book.title} onChange={(event) => { update('title', event.target.value); if (!isEditing) update('slug', createSlug(event.target.value)) }} required /></label><label><span>Author</span><input value={book.author} onChange={(event) => update('author', event.target.value)} required /></label><label><span>Genre</span><input value={book.genre} onChange={(event) => update('genre', event.target.value)} required /></label><label className="span-two"><span>Short description</span><input value={book.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} maxLength={180} required /><small>{book.shortDescription.length}/180</small></label><label className="span-two"><span>Full description</span><textarea value={book.description} onChange={(event) => update('description', event.target.value)} rows={6} required /></label></div></fieldset>
          <fieldset><legend>Publication details</legend><div className="admin-form-grid"><label><span>Format</span><select value={book.format} onChange={(event) => update('format', event.target.value as BookFormat)}><option>Paperback</option><option>Hardcover</option></select></label><label><span>Publisher</span><input value={book.publisher} onChange={(event) => update('publisher', event.target.value)} /></label><label><span>Publication year</span><input type="number" value={book.publicationYear} onChange={(event) => update('publicationYear', Number(event.target.value))} min="1000" max="2100" /></label><label><span>Page count</span><input type="number" value={book.pageCount} onChange={(event) => update('pageCount', Number(event.target.value))} min="1" /></label><label><span>ISBN</span><input value={book.isbn} onChange={(event) => update('isbn', event.target.value)} /></label><label><span>URL slug</span><input value={book.slug} onChange={(event) => update('slug', createSlug(event.target.value))} /></label></div></fieldset>
          <fieldset><legend>Price and inventory</legend><div className="admin-form-grid"><label><span>Price ($)</span><input type="number" step="0.01" value={book.price} onChange={(event) => update('price', Number(event.target.value))} min="0.01" required /></label><label><span>Inventory count</span><input type="number" value={book.inventoryCount} onChange={(event) => update('inventoryCount', Number(event.target.value))} min="0" required /></label></div></fieldset>
          <fieldset><legend>Bookseller selections</legend><div className="admin-check-grid"><label><input type="checkbox" checked={Boolean(book.staffPick)} onChange={(event) => update('staffPick', event.target.checked)} /><span><strong>Staff pick</strong><small>Add the handwritten recommendation ribbon</small></span></label><label><input type="checkbox" checked={Boolean(book.featured)} onChange={(event) => update('featured', event.target.checked)} /><span><strong>Featured</strong><small>Eligible for homepage placement</small></span></label><label><input type="checkbox" checked={Boolean(book.newArrival)} onChange={(event) => update('newArrival', event.target.checked)} /><span><strong>New arrival</strong><small>Show among recent additions</small></span></label></div>{book.staffPick && <label className="admin-staff-note"><span>Bookseller note</span><textarea rows={3} value={book.staffNote ?? ''} onChange={(event) => update('staffNote', event.target.value)} placeholder="Why should someone read this?" /></label>}</fieldset>
        </div>
        <aside className="admin-form-aside">
          <section className="admin-cover-editor"><h2>Cover treatment</h2><div className="admin-cover-preview"><BookCover book={{ ...book, coverUrl: coverPreview || book.coverUrl }} />{(coverPreview || book.coverUrl) && <button className="remove-cover-image" type="button" onClick={() => { setCoverFile(null); setCoverPreview(''); update('coverUrl', ''); update('coverPath', '') }} aria-label="Remove cover image"><X size={15} /></button>}</div><label className="cover-upload-control"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseCover(event.target.files?.[0])} /><span><ImagePlus size={16} /> {coverPreview || book.coverUrl ? 'Replace cover image' : 'Upload cover image'}</span><small>JPG, PNG, or WebP · up to 5 MB</small></label>{uploadProgress > 0 && uploadProgress < 100 && <div className="cover-upload-progress" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${uploadProgress}%` }} /></div>}<div className="cover-or-divider"><span>or use a bookshop treatment</span></div><label><span>Cover symbol</span><input value={book.coverMark} onChange={(event) => update('coverMark', event.target.value.slice(0, 2))} maxLength={2} /></label><div className="palette-options" role="group" aria-label="Cover color">{palettes.map((palette) => <button className={`cover-${palette}${book.coverPalette === palette ? ' selected' : ''}`} type="button" key={palette} onClick={() => update('coverPalette', palette)} aria-label={`${palette} cover`} aria-pressed={book.coverPalette === palette}>{book.coverPalette === palette && <Check size={14} />}</button>)}</div></section>
          <section className="admin-publish-card"><h2>Publication</h2><label><span>Status</span><select value={book.status ?? 'draft'} onChange={(event) => update('status', event.target.value as BookStatus)}><option value="draft">Draft</option><option value="active">Published</option><option value="archived">Archived</option></select></label><p>Published books appear in the public catalog. Drafts remain visible only to staff.</p><button className="admin-primary-button" type="submit" disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save book'}</button>{(book.status ?? 'draft') !== 'active' && <button className="admin-publish-now" type="button" disabled={saving} onClick={(event) => void handleSubmit(event, 'active')}>Save &amp; publish</button>}</section>
        </aside>
      </form>
    </main>
  )
}
