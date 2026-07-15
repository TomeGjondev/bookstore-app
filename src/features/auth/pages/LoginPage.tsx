import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.context'
import { friendlyAuthError } from '../auth.service'
import { AuthShell } from '../components/AuthShell'

export function LoginPage() {
  const { signIn, configured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSubmitting(true)
    setError('')
    try {
      await signIn(String(form.get('email')), String(form.get('password')))
      const destination = (location.state as { from?: string } | null)?.from ?? '/account'
      navigate(destination, { replace: true })
    } catch (caught) {
      setError(friendlyAuthError(caught))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell eyebrow="Welcome back" title="Return to your corner." intro="Sign in to find your wishlist, saved bag, and the books you meant to come back for.">
      {!configured && <div className="auth-setup-note"><strong>Firebase connection needed</strong><span>Add the values from your Firebase web app to <code>.env.local</code> to enable account actions.</span></div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="reader@example.com" required /></label>
        <label><span>Password <Link to="/forgot-password">Forgot password?</Link></span><div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Opening the door…' : <>Sign in <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">New to the shop? <Link to="/register">Create an account</Link></p>
    </AuthShell>
  )
}
