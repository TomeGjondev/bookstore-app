import { useEffect, useState } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth.context'
import { hasAdminClaim } from '../../features/admin/admin.service'
import { isFirebaseConfigured } from '../../lib/firebase/config'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [checking, setChecking] = useState(Boolean(isFirebaseConfigured && user))
  const [allowed, setAllowed] = useState(!isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    if (!user) {
      setAllowed(false)
      setChecking(false)
      return
    }
    let active = true
    setChecking(true)
    void hasAdminClaim(user).then((isAdmin) => {
      if (active) setAllowed(isAdmin)
    }).catch(() => {
      if (active) setAllowed(false)
    }).finally(() => {
      if (active) setChecking(false)
    })
    return () => { active = false }
  }, [user])

  if (loading || checking) return <main className="route-loading admin-route-loading"><span className="book-loader" /><p>Checking the shop keys…</p></main>
  if (!allowed) return <main className="admin-denied"><div><LockKeyhole size={38} /><p className="eyebrow">Private staff room</p><h1>You don’t have the shop keys.</h1><p>Administrator access is granted through a secure Firebase custom claim. Sign in with an authorized account and try again.</p><Link className="button button-ink" to={user ? '/account' : '/login'}><ArrowLeft size={16} /> {user ? 'Return to your account' : 'Sign in'}</Link></div></main>
  return children
}
