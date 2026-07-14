import { ArrowRight, BookHeart, Compass, Feather, Flower2, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BookCard, type FeaturedBook } from '../components/BookCard'

const books: FeaturedBook[] = [
  { title: 'The Map of Small Things', author: 'Elena Moss', price: '$18.00', palette: 'cover-ochre', label: 'Mara’s pick', mark: '✦' },
  { title: 'When the River Remembers', author: 'Jon Bellweather', price: '$21.00', palette: 'cover-river', mark: '≈' },
  { title: 'Letters from the Greenhouse', author: 'Iris Wren', price: '$16.50', palette: 'cover-moss', label: 'Bestseller', mark: '❦' },
  { title: 'A Study in Starlight', author: 'C. A. Nightingale', price: '$24.00', palette: 'cover-night', mark: '✧' },
]

const categories = [
  { name: 'Fiction', note: 'Lives unlike our own', icon: Feather, tone: 'clay' },
  { name: 'Nature writing', note: 'The wild, observed', icon: Flower2, tone: 'moss' },
  { name: 'Travel & place', note: 'Elsewhere, slowly', icon: Compass, tone: 'blue' },
  { name: 'Poetry', note: 'A world in a handful', icon: Sparkles, tone: 'ochre' },
]

export function HomePage() {
  return (
    <main id="main-content">
      <section className="hero">
        <img src="/images/bookstore-hero.webp" alt="A warmly lit bookstore reading corner with an armchair, bookshelves, and an open book" />
        <div className="hero-shade" />
        <div className="hero-content page-shell">
          <p className="eyebrow light"><span /> Your neighborhood bookshop</p>
          <h1>Come in.<br /><em>Stay curious.</em></h1>
          <p className="hero-copy">Stories chosen with care, shelves made for wandering, and always a chair waiting in the corner.</p>
          <div className="hero-actions">
            <Link className="button button-paper" to="/books">Browse the shelves <ArrowRight size={17} /></Link>
            <Link className="text-link light-link" to="/staff-picks">Meet our booksellers</Link>
          </div>
        </div>
        <div className="hero-note" aria-label="Staff note">
          <span>Today’s shelf note</span>
          <p>“Read what delights you. The rest can wait.”</p>
          <small>— Mara, bookseller</small>
        </div>
      </section>

      <section className="search-ribbon" aria-label="Book search">
        <div className="page-shell ribbon-inner">
          <div><Search size={20} /><span>What would you like to read next?</span></div>
          <Link to="/books">Search by title, author, or feeling <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="section page-shell staff-section">
        <div className="section-heading">
          <div><p className="eyebrow">Chosen by people who read past bedtime</p><h2>From our hands<br /><em>to yours</em></h2></div>
          <div className="heading-aside"><p>Every book here has been read, loved, debated, or pressed eagerly into a friend’s hands.</p><Link className="text-link" to="/staff-picks">See all staff picks <ArrowRight size={16} /></Link></div>
        </div>
        <div className="book-grid">{books.map((book) => <BookCard key={book.title} book={book} />)}</div>
      </section>

      <section className="quote-panel">
        <div className="page-shell quote-inner">
          <BookHeart size={31} strokeWidth={1.3} />
          <blockquote>“A good bookshop is not just about selling books. It is a place that reminds you who you might yet become.”</blockquote>
          <span aria-hidden="true">❦</span>
        </div>
      </section>

      <section className="section page-shell categories-section">
        <div className="section-heading compact"><div><p className="eyebrow">Find your way in</p><h2>Wander by <em>mood</em></h2></div><Link className="text-link" to="/books">Explore every shelf <ArrowRight size={16} /></Link></div>
        <div className="category-grid">
          {categories.map(({ name, note, icon: Icon, tone }) => (
            <Link to={`/books?genre=${encodeURIComponent(name.toLowerCase())}`} className={`category-card ${tone}`} key={name}>
              <Icon size={30} strokeWidth={1.35} />
              <div><h3>{name}</h3><p>{note}</p></div>
              <ArrowRight className="category-arrow" size={19} />
            </Link>
          ))}
        </div>
      </section>

      <section className="visit-section">
        <div className="page-shell visit-grid">
          <div className="visit-visual" aria-hidden="true"><span className="sun" /><div className="window"><span /><span /><span /></div><p>12 Bramble Lane</p></div>
          <div className="visit-copy">
            <p className="eyebrow">A place for unhurried afternoons</p>
            <h2>There’s a chair<br /><em>with your name on it.</em></h2>
            <p>Find us tucked between the florist and the old cinema. Stay for a recommendation, a cup of tea, or simply the quiet.</p>
            <div className="hours"><span>Monday–Saturday<strong>9am–7pm</strong></span><span>Sunday<strong>10am–5pm</strong></span></div>
            <Link className="button button-ink" to="/about">Plan your visit <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="letters-section" id="letters">
        <div className="page-shell letters-inner">
          <div><p className="eyebrow light">Notes from the shop</p><h2>A little letter,<br /><em>now and then.</em></h2></div>
          <form className="letter-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="email">New books, old favorites, and invitations to linger.</label>
            <div><input id="email" type="email" placeholder="Your email address" autoComplete="email" required /><button type="submit" aria-label="Join the mailing list"><ArrowRight size={20} /></button></div>
            <small>No clutter. Just good stories, once or twice a month.</small>
          </form>
        </div>
      </section>
    </main>
  )
}
