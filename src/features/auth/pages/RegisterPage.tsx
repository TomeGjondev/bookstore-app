import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.context'
import { friendlyAuthError } from '../auth.service'
import { AuthShell } from '../components/AuthShell'

export function RegisterPage() {
  const { register, configured } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password'))
    if (password.length < 8) return setError('Please choose a password with at least eight characters.')
    if (password !== String(form.get('confirmPassword'))) return setError('Those passwords do not match yet.')
    setSubmitting(true)
    setError('')
    try {
      await register(String(form.get('name')), String(form.get('email')), password)
      navigate('/account', { replace: true })
    } catch (caught) {
      setError(friendlyAuthError(caught))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell eyebrow="Make yourself at home" title="Keep the stories you love close." intro="Create an account for a bag that follows you, a wishlist of discoveries, and thoughtful recommendations.">
      {!configured && <div className="auth-setup-note"><strong>Firebase connection needed</strong><span>Registration will activate once the Firebase values are added to <code>.env.local</code>.</span></div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label><span>Your name</span><input name="name" autoComplete="name" placeholder="How should we greet you?" required /></label>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="reader@example.com" required /></label>
        <div className="form-pair"><label><span>Password</span><input name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required /></label><label><span>Confirm</span><input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Once more" minLength={8} required /></label></div>
        <p className="password-hint"><Check size={14} /> Eight or more characters</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Making your place…' : <>Create my account <ArrowRight size={17} /></>}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthShell>
  )
}
