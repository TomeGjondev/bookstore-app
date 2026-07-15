import { useState } from 'react'
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { filterBooks } from '../catalog.utils'
import { CatalogBookCard } from '../components/CatalogBookCard'
import { useCatalog } from '../catalog.context'

const PAGE_SIZE = 8

const priceLabels: Record<string, string> = {
  'under-15': 'Under $15',
  '15-20': '$15–$20',
  'over-20': 'Over $20',
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { books, genres } = useCatalog()

  const filters = {
    query: params.get('q') ?? '',
    genre: params.get('genre') ?? '',
    format: params.get('format') ?? '',
    price: params.get('price') ?? '',
    inStock: params.get('inStock') === 'true',
    sort: params.get('sort') ?? 'recommended',
  }

  const results = filterBooks(books, filters)
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const requestedPage = Number(params.get('page') ?? 1)
  const page = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages)
  const visibleBooks = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next, { replace: key === 'q' })
  }

  const clearFilters = () => {
    const sort = params.get('sort')
    setParams(sort && sort !== 'recommended' ? { sort } : {})
  }

  const activeFilters = [
    filters.query && { key: 'q', label: `“${filters.query}”` },
    filters.genre && { key: 'genre', label: filters.genre },
    filters.format && { key: 'format', label: filters.format },
    filters.price && { key: 'price', label: priceLabels[filters.price] },
    filters.inStock && { key: 'inStock', label: 'In stock' },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <main id="main-content" className="catalog-page">
      <section className="catalog-hero">
        <div className="page-shell catalog-hero-inner">
          <div>
            <p className="eyebrow light">The whole bookshop, within reach</p>
            <h1>Browse the <em>shelves</em></h1>
            <p>Follow a familiar author, wander into a new subject, or simply see which cover catches your eye.</p>
          </div>
          <div className="catalog-hero-flourish" aria-hidden="true"><span>12</span><small>books waiting</small></div>
        </div>
      </section>

      <section className="page-shell catalog-toolbar" aria-label="Search and sort books">
        <label className="catalog-search">
          <Search size={20} />
          <span className="sr-only">Search books</span>
          <input value={filters.query} onChange={(event) => updateParam('q', event.target.value)} placeholder="Search by title, author, or genre…" />
          {filters.query && <button type="button" onClick={() => updateParam('q')} aria-label="Clear search"><X size={17} /></button>}
        </label>
        <button type="button" className="filter-trigger" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={18} /> Filters {activeFilters.length > 0 && <span>{activeFilters.length}</span>}</button>
        <label className="sort-select">
          <span>Sort by</span>
          <select value={filters.sort} onChange={(event) => updateParam('sort', event.target.value)}>
            <option value="recommended">Our recommendations</option>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="title">Title: A–Z</option>
          </select>
          <ChevronDown size={15} aria-hidden="true" />
        </label>
      </section>

      {activeFilters.length > 0 && (
        <div className="page-shell active-filter-row" aria-label="Active filters">
          {activeFilters.map((filter) => <button key={filter.key} type="button" onClick={() => updateParam(filter.key)}>{filter.label}<X size={14} /></button>)}
          <button type="button" className="clear-filters" onClick={clearFilters}>Clear all</button>
        </div>
      )}

      <section className="page-shell catalog-layout">
        <aside className={filtersOpen ? 'filter-panel is-open' : 'filter-panel'} aria-label="Book filters">
          <div className="filter-mobile-header"><strong>Filter the shelves</strong><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X /></button></div>
          <div className="filter-title"><span><Filter size={16} /> Refine your browse</span>{activeFilters.length > 0 && <button type="button" onClick={clearFilters}>Reset</button>}</div>
          <fieldset>
            <legend>Genre</legend>
            <label><input type="radio" name="genre" checked={!filters.genre} onChange={() => updateParam('genre')} /><span>All genres</span><small>{books.length}</small></label>
            {genres.map((genre) => <label key={genre}><input type="radio" name="genre" checked={filters.genre.toLowerCase() === genre.toLowerCase()} onChange={() => updateParam('genre', genre)} /><span>{genre}</span><small>{books.filter((book) => book.genre === genre).length}</small></label>)}
          </fieldset>
          <fieldset>
            <legend>Format</legend>
            {['Hardcover', 'Paperback'].map((format) => <label key={format}><input type="checkbox" checked={filters.format === format} onChange={() => updateParam('format', filters.format === format ? undefined : format)} /><span>{format}</span></label>)}
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            {Object.entries(priceLabels).map(([value, label]) => <label key={value}><input type="radio" name="price" checked={filters.price === value} onChange={() => updateParam('price', filters.price === value ? undefined : value)} /><span>{label}</span></label>)}
          </fieldset>
          <label className="stock-toggle"><span><strong>On our shelves now</strong><small>Hide books that are coming back soon</small></span><input type="checkbox" checked={filters.inStock} onChange={(event) => updateParam('inStock', event.target.checked ? 'true' : undefined)} /></label>
          <button type="button" className="button button-ink apply-filters" onClick={() => setFiltersOpen(false)}>Show {results.length} books</button>
        </aside>
        {filtersOpen && <button type="button" className="filter-backdrop" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />}

        <div className="catalog-results">
          <div className="results-heading"><p><strong>{results.length}</strong> {results.length === 1 ? 'book' : 'books'} found</p><span>Page {page} of {totalPages}</span></div>
          {visibleBooks.length > 0 ? (
            <div className="catalog-grid">{visibleBooks.map((book) => <CatalogBookCard key={book.id} book={book} />)}</div>
          ) : (
            <div className="catalog-empty"><span aria-hidden="true">⌇</span><h2>No books found on this shelf</h2><p>Try a broader search, or let us return you to everything in the shop.</p><button className="button button-ink" type="button" onClick={clearFilters}>Browse all books</button></div>
          )}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Catalog pagination">
              <button type="button" disabled={page === 1} onClick={() => updateParam('page', String(page - 1))}>Previous</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button className={number === page ? 'current' : ''} aria-current={number === page ? 'page' : undefined} type="button" key={number} onClick={() => updateParam('page', String(number))}>{number}</button>)}
              <button type="button" disabled={page === totalPages} onClick={() => updateParam('page', String(page + 1))}>Next</button>
            </nav>
          )}
        </div>
      </section>
    </main>
  )
}
