import { useState } from 'react'
import { BookOpen, ExternalLink, LayoutDashboard, Library, Menu, Settings, X } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import { isFirebaseConfigured } from '../../../lib/firebase/config'

export function AdminLayout() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const name = user?.displayName || 'Preview bookseller'

  return (
    <div className="admin-shell">
      <aside className={open ? 'admin-sidebar is-open' : 'admin-sidebar'}>
        <div className="admin-brand"><span><BookOpen size={19} /></span><div><strong>Lantern &amp; Leaf</strong><small>Bookseller desk</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close admin menu"><X size={19} /></button></div>
        <nav aria-label="Admin navigation"><NavLink to="/admin" end onClick={() => setOpen(false)}><LayoutDashboard size={18} /> Overview</NavLink><NavLink to="/admin/books" onClick={() => setOpen(false)}><Library size={18} /> Books</NavLink><span><Settings size={18} /> Settings <small>Soon</small></span></nav>
        <div className="admin-user"><div>{name.slice(0, 1).toUpperCase()}</div><span><strong>{name}</strong><small>{user?.email || 'Development preview'}</small></span></div>
        <Link className="admin-store-link" to="/"><ExternalLink size={15} /> View the bookshop</Link>
      </aside>
      {open && <button className="admin-sidebar-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Close admin menu" />}
      <div className="admin-main">
        <header className="admin-mobile-header"><button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu"><Menu size={21} /></button><strong>Bookseller desk</strong><Link to="/"><ExternalLink size={18} /></Link></header>
        {!isFirebaseConfigured && <div className="admin-preview-banner"><strong>Preview mode</strong><span>The workspace uses development books. Connect Firebase and sign in with an admin claim to save changes.</span></div>}
        <Outlet />
      </div>
    </div>
  )
}
