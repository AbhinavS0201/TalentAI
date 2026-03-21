import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  const fillDemo = (role) => {
    const demos = {
      jobseeker: { email: 'demo.seeker@talentai.com', password: 'demo123' },
      recruiter: { email: 'demo.recruiter@talentai.com', password: 'demo123' },
      admin: { email: 'demo.admin@talentai.com', password: 'demo123' },
    }
    setForm(demos[role])
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb" />
      </div>
      <div className="auth-container">
        <div className="auth-card animate-fade">
          <div className="auth-logo">
            <Sparkles size={22} />
            <span>Talent<span className="logo-accent">AI</span></span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to continue your job search journey</p>

          <div className="demo-btns">
            <span className="demo-label">Try demo:</span>
            <button className="demo-btn" onClick={() => fillDemo('jobseeker')}>Job Seeker</button>
            <button className="demo-btn" onClick={() => fillDemo('recruiter')}>Recruiter</button>
            <button className="demo-btn" onClick={() => fillDemo('admin')}>Admin</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email" className="input input-with-icon" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'} className="input input-with-icon input-with-end"
                  placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="input-end" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner" style={{width:18,height:18,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',display:'inline-block'}} /> : null}
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register" className="auth-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
