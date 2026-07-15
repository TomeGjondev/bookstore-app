import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth.context'
import { friendlyAuthError } from '../auth.service'
import { AuthShell } from '../components/AuthShell'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      const form = new FormData(event.currentTarget)
      await resetPassword(String(form.get('email')))
      setSent(true)
    } catch (caught) {
      setError(friendlyAuthError(caught))
    }
  }

  return (
    <AuthShell eyebrow="Find your way back" title="Forgot your password?" intro="No trouble. Tell us where to send the reset link and we’ll help you back inside.">
      {sent ? <div className="reset-success"><CheckCircle2 size={35} /><h2>Check your inbox</h2><p>If an account matches that address, a reset letter is on its way.</p><Link className="text-link" to="/login"><ArrowLeft size={15} /> Return to sign in</Link></div> : <><form className="auth-form" onSubmit={handleSubmit}><label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="reader@example.com" required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button auth-submit" type="submit">Send reset link <ArrowRight size={17} /></button></form><p className="auth-switch"><Link to="/login">Back to sign in</Link></p></>}
    </AuthShell>
  )
}
