import { useState } from 'react'
import { BookOpen, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth.context'
import { useCart } from '../../features/cart/cart.context'

const links = [
  { label: 'Books', to: '/books' },
  { label: 'Staff picks', to: '/staff-picks' },
  { label: 'New arrivals', to: '/new-arrivals' },
  { label: 'Our story', to: '/about' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <div className="announcement">Free local delivery on orders over $35 <span aria-hidden="true">·</span> Wrapped with care</div>
      <div className="nav-shell page-shell">
        <button className="icon-button mobile-menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Link to="/" className="brand" aria-label="The Lantern and Leaf, home">
          <span className="brand-mark"><BookOpen size={21} strokeWidth={1.7} /></span>
          <span><strong>The Lantern</strong><em>&amp; Leaf</em></span>
        </Link>
        <nav className={open ? 'primary-nav is-open' : 'primary-nav'} aria-label="Main navigation">
          {links.map((link) => <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink>)}
        </nav>
        <div className="nav-actions">
          <Link className="icon-button hide-small" to="/books" aria-label="Search books"><Search size={20} /></Link>
          <Link className="icon-button hide-small" to={user ? '/account' : '/login'} aria-label={user ? 'Your account' : 'Sign in'}><UserRound size={20} /></Link>
          <Link className="bag-link" to="/cart" aria-label={`Book bag, ${itemCount} items`}><ShoppingBag size={20} /><span className="bag-label">Bag</span><span className="bag-count" aria-hidden="true">{itemCount}</span></Link>
          <span className="sr-only" aria-live="polite">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your book bag</span>
        </div>
      </div>
    </header>
  )
}
