import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Mail, Save, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../catalog/catalog.context'
import { useAuth } from '../../auth/auth.context'
import { friendlyAuthError } from '../../auth/auth.service'
import { getReaderPreferences, saveReaderProfile } from '../account.service'

export function ProfilePage() {
  const { user, updateName } = useAuth()
  const { genres } = useCatalog()
  const [name, setName] = useState(user?.displayName ?? '')
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([])
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    void getReaderPreferences(user.uid).then((preferences) => {
      setFavoriteGenres(preferences.favoriteGenres)
      setNewsletter(preferences.newsletter)
    }).finally(() => setLoading(false))
  }, [user])

  const toggleGenre = (genre: string) => setFavoriteGenres((current) => current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!user) return
    if (name.trim().length < 2) return setError('Please enter at least two characters for your name.')
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await Promise.all([
        updateName(name.trim()),
        saveReaderProfile(user.uid, name.trim(), { favoriteGenres, newsletter }),
      ])
      setSaved(true)
    } catch (caught) {
      setError(friendlyAuthError(caught))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main id="main-content" className="profile-page">
      <section className="profile-heading page-shell"><Link to="/account"><ArrowLeft size={15} /> Back to your account</Link><p className="eyebrow">A few details about you</p><h1>Your reader profile</h1><p>Help us greet you properly and keep recommendations aligned with what you love.</p></section>
      <section className="page-shell profile-layout">
        <aside><div className="profile-avatar"><UserRound size={35} /></div><strong>{user?.displayName || 'Reader'}</strong><span><Mail size={13} /> {user?.email}</span><p>Your email is managed securely by Firebase Authentication and cannot be changed from this page.</p></aside>
        <form className="profile-form" onSubmit={handleSubmit}>
          {loading ? <div className="profile-loading">Opening your reader card…</div> : <>
            <fieldset><legend>About you</legend><label><span>Display name</span><input value={name} onChange={(event) => { setName(event.target.value); setSaved(false) }} autoComplete="name" maxLength={60} required /><small>This is how we’ll greet you around the shop.</small></label><label><span>Email address</span><input value={user?.email ?? ''} type="email" disabled /></label></fieldset>
            <fieldset><legend>Your favorite shelves <small>Choose as many as you like</small></legend><div className="genre-choices">{genres.map((genre) => <label className={favoriteGenres.includes(genre) ? 'selected' : ''} key={genre}><input type="checkbox" checked={favoriteGenres.includes(genre)} onChange={() => { toggleGenre(genre); setSaved(false) }} /><span>{genre}</span>{favoriteGenres.includes(genre) && <Check size={14} />}</label>)}</div></fieldset>
            <fieldset><legend>Letters from the shop</legend><label className="newsletter-choice"><input type="checkbox" checked={newsletter} onChange={(event) => { setNewsletter(event.target.checked); setSaved(false) }} /><span><strong>Send me the occasional shop letter</strong><small>New arrivals, events, and thoughtful recommendations—once or twice a month.</small></span></label></fieldset>
            {error && <p className="form-error" role="alert">{error}</p>}
            {saved && <p className="form-success" role="status"><Check size={15} /> Your reader profile is saved.</p>}
            <button className="button profile-save" type="submit" disabled={saving}>{saving ? 'Saving your card…' : <><Save size={16} /> Save changes</>}</button>
          </>}
        </form>
      </section>
    </main>
  )
}
