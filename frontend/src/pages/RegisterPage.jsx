import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import './AuthPage.css'

const ROLES = [
  { value: 'jobseeker', label: 'Job Seeker', icon: '🎯', desc: 'Find your dream job' },
  { value: 'recruiter', label: 'Recruiter', icon: '🏢', desc: 'Hire top talent' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' })
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    try {
      await register(form.name, form.email, form.password, form.role)
      toast.success('Account created! Welcome to TalentAI 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-orb" /></div>
      <div className="auth-container">
        <div className="auth-card animate-fade">
          <div className="auth-logo">
            <Sparkles size={22} />
            <span>Talent<span className="logo-accent">AI</span></span>
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-sub">Join 200,000+ professionals on TalentAI</p>

          <div className="role-tabs">
            {ROLES.map(r => (
              <button key={r.value} type="button"
                className={`role-tab ${form.role === r.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: r.value })}>
                <span className="role-icon">{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input type="text" className="input input-with-icon" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input type="email" className="input input-with-icon" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input type={showPwd ? 'text' : 'password'} className="input input-with-icon input-with-end"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="input-end" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading
                ? <span className="spinner" style={{width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',display:'inline-block'}} />
                : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>
          <p className="auth-footer-text">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
