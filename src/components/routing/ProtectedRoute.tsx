import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth.context'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <main className="route-loading"><span className="book-loader" /><p>Finding your place…</p></main>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}
