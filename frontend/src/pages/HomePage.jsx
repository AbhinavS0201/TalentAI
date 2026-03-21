import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Sparkles, ArrowRight, Briefcase, Users, TrendingUp, Zap, Star, CheckCircle } from 'lucide-react'
import api from '../utils/api'
import JobCard from '../components/jobs/JobCard'
import './HomePage.css'

const CATEGORIES = [
  { name: 'Engineering', icon: '⚙️', count: '2.4k' },
  { name: 'Design', icon: '🎨', count: '1.2k' },
  { name: 'Marketing', icon: '📣', count: '890' },
  { name: 'Finance', icon: '💰', count: '1.5k' },
  { name: 'Data Science', icon: '📊', count: '980' },
  { name: 'Product', icon: '🚀', count: '760' },
  { name: 'Sales', icon: '🤝', count: '1.1k' },
  { name: 'HR', icon: '👥', count: '430' },
]

const STATS = [
  { icon: Briefcase, value: '50K+', label: 'Active Jobs' },
  { icon: Users, value: '200K+', label: 'Job Seekers' },
  { icon: TrendingUp, value: '95%', label: 'Placement Rate' },
  { icon: Zap, value: 'AI', label: 'Powered Matching' },
]

const FEATURES = [
  { icon: '🤖', title: 'AI Cover Letter', desc: 'Generate personalized cover letters in seconds with GPT-4' },
  { icon: '📊', title: 'Resume Scoring', desc: 'Get AI-powered resume match scores before applying' },
  { icon: '🔔', title: 'Real-time Alerts', desc: 'Instant notifications when your application status changes' },
  { icon: '🎯', title: 'Smart Matching', desc: 'AI suggests jobs that perfectly match your skill set' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [featuredJobs, setFeaturedJobs] = useState([])

  useEffect(() => {
    api.get('/jobs?limit=6').then(r => setFeaturedJobs(r.data.jobs || [])).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?search=${search}&location=${location}`)
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={14} />
            <span>AI-Powered Job Platform</span>
          </div>
          <h1 className="hero-title animate-fade" style={{ animationDelay: '0.2s' }}>
            Find Your Dream Job<br />
            <span className="gradient-text">With the Power of AI</span>
          </h1>
          <p className="hero-subtitle animate-fade" style={{ animationDelay: '0.3s' }}>
            TalentAI matches you with perfect opportunities using advanced AI. Generate cover letters, get resume scores, and land your dream job faster.
          </p>

          <form className="search-bar animate-fade" style={{ animationDelay: '0.4s' }} onSubmit={handleSearch}>
            <div className="search-field">
              <Search size={18} className="search-icon" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Job title, skills, or keywords..."
                className="search-input"
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <MapPin size={18} className="search-icon" />
              <input
                value={location} onChange={e => setLocation(e.target.value)}
                placeholder="City or remote..."
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn">
              <Search size={16} /> Search Jobs
            </button>
          </form>

          <div className="hero-tags animate-fade" style={{ animationDelay: '0.5s' }}>
            <span className="tag-label">Popular:</span>
            {['React Developer', 'UI/UX Designer', 'Data Analyst', 'Product Manager'].map(t => (
              <Link key={t} to={`/jobs?search=${t}`} className="hero-tag">{t}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="stat-card">
                <div className="stat-icon"><Icon size={22} /></div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Browse by Category</h2>
            <Link to="/jobs" className="btn btn-ghost btn-sm">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/jobs?category=${cat.name}`} className="category-card">
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{cat.count} jobs</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Featured Jobs</h2>
              <Link to="/jobs" className="btn btn-ghost btn-sm">See all <ArrowRight size={14} /></Link>
            </div>
            <div className="jobs-grid">
              {featuredJobs.map(job => <JobCard key={job._id} job={job} />)}
            </div>
          </div>
        </section>
      )}

      {/* AI Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-inner">
            <div className="features-left">
              <div className="feat-badge"><Sparkles size={14} /> AI Features</div>
              <h2 className="features-title">Supercharge Your<br />Job Search with AI</h2>
              <p className="features-desc">Our AI tools give you an unfair advantage. Generate perfect cover letters, analyze your resume, and get matched to ideal jobs automatically.</p>
              <div className="feature-checks">
                {['Free AI cover letter generator', 'Resume match scoring', 'Smart job recommendations', 'Real-time application tracking'].map(f => (
                  <div key={f} className="feat-check"><CheckCircle size={16} className="check-icon" />{f}</div>
                ))}
              </div>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: 24, display: 'inline-flex' }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
            </div>
            <div className="features-right">
              {FEATURES.map(f => (
                <div key={f.title} className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc-text">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb" />
            <div className="cta-content">
              <h2 className="cta-title">Ready to Land Your Dream Job?</h2>
              <p className="cta-sub">Join 200,000+ professionals already using TalentAI</p>
              <div className="cta-btns">
                <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
                <Link to="/jobs" className="btn btn-secondary btn-lg">Browse Jobs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <Sparkles size={18} className="logo-icon" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Talent<span className="logo-accent">AI</span></span>
            </div>
            <div className="footer-links">
              <Link to="/jobs">Jobs</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Sign In</Link>
            </div>
            <div className="footer-copy">© 2025 TalentAI. Built with ❤️ for dreamers.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
