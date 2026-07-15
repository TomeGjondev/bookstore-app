import { BookOpen, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AuthShell({ children, eyebrow, title, intro }: { children: React.ReactNode; eyebrow: string; title: string; intro: string }) {
  return (
    <main id="main-content" className="auth-page">
      <section className="auth-atmosphere" aria-hidden="true">
        <div className="auth-lamp"><span /></div>
        <div className="auth-books"><span /><span /><span /><span /><span /></div>
        <div className="auth-quote"><Quote size={23} /><p>A bookshop is one of the only pieces of evidence we have that people are still thinking.</p><small>— Jerry Seinfeld</small></div>
      </section>
      <section className="auth-panel">
        <Link to="/" className="auth-brand"><BookOpen size={20} /> The Lantern &amp; Leaf</Link>
        <div className="auth-form-wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-intro">{intro}</p>
          {children}
        </div>
      </section>
    </main>
  )
}
