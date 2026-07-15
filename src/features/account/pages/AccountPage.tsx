import { BookHeart, LogOut, Mail, Pencil, ShoppingBag, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import { useCart } from '../../cart/cart.context'
import { useWishlist } from '../../wishlist/wishlist.context'

export function AccountPage() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const { bookIds } = useWishlist()
  const navigate = useNavigate()
  const name = user?.displayName || user?.email?.split('@')[0] || 'Reader'

  return (
    <main id="main-content" className="account-page">
      <section className="account-hero"><div className="page-shell"><p className="eyebrow light">Your place in the shop</p><h1>Good to see you, <em>{name}.</em></h1><p>Your saved stories and reading life, gathered in one quiet corner.</p></div></section>
      <section className="page-shell account-grid">
        <aside className="account-profile"><div className="account-avatar"><UserRound size={30} /></div><h2>{name}</h2><p><Mail size={14} /> {user?.email}</p><Link to="/account/profile"><Pencil size={14} /> Edit reader profile</Link><button type="button" onClick={async () => { await signOut(); navigate('/') }}><LogOut size={16} /> Sign out</button></aside>
        <div className="account-cards">
          <Link to="/cart"><ShoppingBag size={25} /><div><span>Your book bag</span><strong>{itemCount ? `${itemCount} ${itemCount === 1 ? 'book' : 'books'} waiting` : 'Ready for your next find'}</strong></div></Link>
          <Link to="/account/wishlist"><BookHeart size={25} /><div><span>Your wishlist</span><strong>{bookIds.length ? `${bookIds.length} ${bookIds.length === 1 ? 'story' : 'stories'} saved for later` : 'Keep the ones you want to remember'}</strong></div></Link>
          <div className="account-note"><span>From the shop</span><p>“The best reading lists leave a little room for surprise.”</p><small>— Mara</small></div>
        </div>
      </section>
    </main>
  )
}
