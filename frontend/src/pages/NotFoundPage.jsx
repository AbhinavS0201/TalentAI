import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', gap: '20px' }}>
      <div style={{ fontSize: '6rem', lineHeight: 1 }}>404</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text2)', maxWidth: 400 }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/" className="btn btn-primary btn-lg"><Sparkles size={16} /> Go Home</Link>
        <Link to="/jobs" className="btn btn-secondary btn-lg">Browse Jobs</Link>
      </div>
    </div>
  )
}
