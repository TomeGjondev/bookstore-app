import { BookOpen, Instagram, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <span className="brand-mark light"><BookOpen size={22} /></span>
          <h2>The Lantern &amp; Leaf</h2>
          <p>An independent bookshop for curious minds, quiet moments, and stories worth carrying home.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/books">Browse books</Link>
          <Link to="/staff-picks">Staff picks</Link>
          <Link to="/new-arrivals">New arrivals</Link>
        </div>
        <div>
          <h3>Visit us</h3>
          <p><MapPin size={16} /> 12 Bramble Lane<br />Willowmere</p>
          <p>Mon–Sat, 9–7<br />Sunday, 10–5</p>
        </div>
        <div>
          <h3>Stay awhile</h3>
          <p>Letters from the shop, thoughtful reads, and event invitations.</p>
          <a href="#letters"><Instagram size={16} /> Follow the bookshop</a>
        </div>
      </div>
      <div className="footer-bottom page-shell"><span>© 2026 The Lantern &amp; Leaf</span><span>Made slowly, like a good story.</span></div>
    </footer>
  )
}
