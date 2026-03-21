import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Clock, Star, CheckCircle, XCircle, TrendingUp, Bookmark, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../context/authStore'
import './Dashboard.css'

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-yellow', icon: Clock },
  reviewed: { label: 'Reviewed', color: 'badge-blue', icon: TrendingUp },
  shortlisted: { label: 'Shortlisted', color: 'badge-accent', icon: Star },
  interview: { label: 'Interview', color: 'badge-green', icon: CheckCircle },
  offered: { label: 'Offered! 🎉', color: 'badge-green', icon: CheckCircle },
  rejected: { label: 'Not Selected', color: 'badge-red', icon: XCircle },
}

export default function JobSeekerDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [aiJobs, setAiJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('applications')

  useEffect(() => {
    Promise.all([
      api.get('/users/dashboard-stats'),
      api.get('/applications/my'),
      api.get('/users/saved-jobs'),
    ]).then(([s, a, sj]) => {
      setStats(s.data)
      setApplications(a.data)
      setSavedJobs(sj.data)
      setLoading(false)
    }).catch(() => setLoading(false))

    // AI suggestions
    if (user?.skills?.length > 0) {
      api.get('/ai/job-suggestions').then(r => setAiJobs(r.data)).catch(() => {})
    }
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Loader2 size={32} className="spinner" style={{ color: 'var(--accent)' }} />
    </div>
  )

  return (
    <div className="dashboard-page page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="dash-sub">Track your applications and discover new opportunities</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            <Briefcase size={16} /> Browse Jobs
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-cards">
          {[
            { label: 'Total Applied', value: stats?.total || 0, icon: Briefcase, color: 'accent' },
            { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: Star, color: 'yellow' },
            { label: 'Interviews', value: stats?.interview || 0, icon: CheckCircle, color: 'green' },
            { label: 'Offers', value: stats?.offered || 0, icon: TrendingUp, color: 'green' },
          ].map(s => (
            <div key={s.label} className="stat-item card">
              <div className={`stat-item-icon color-${s.color}`}><s.icon size={20} /></div>
              <div className="stat-item-value">{s.value}</div>
              <div className="stat-item-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* AI Suggestions Banner */}
        {aiJobs.length > 0 && (
          <div className="ai-banner card">
            <div className="ai-banner-left">
              <div className="ai-banner-icon"><Sparkles size={20} /></div>
              <div>
                <div className="ai-banner-title">AI Job Matches For You</div>
                <div className="ai-banner-sub">{aiJobs.length} jobs perfectly match your profile</div>
              </div>
            </div>
            <div className="ai-banner-jobs">
              {aiJobs.slice(0, 3).map(j => (
                <Link key={j._id} to={`/jobs/${j._id}`} className="ai-job-chip">
                  {j.title} at {j.company}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="dash-tabs">
          {[
            { id: 'applications', label: `Applications (${applications.length})` },
            { id: 'saved', label: `Saved Jobs (${savedJobs.length})` },
          ].map(t => (
            <button key={t.id} className={`dash-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Applications */}
        {activeTab === 'applications' && (
          <div className="applications-list">
            {applications.length === 0 ? (
              <div className="empty-state card">
                <Briefcase size={40} className="empty-icon-svg" />
                <h3>No applications yet</h3>
                <p>Start applying to jobs to track them here</p>
                <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
              </div>
            ) : applications.map(app => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending
              return (
                <div key={app._id} className="application-item card">
                  <div className="app-company-logo">
                    {app.job?.companyLogo ? <img src={app.job.companyLogo} alt="" /> : <Briefcase size={18} />}
                  </div>
                  <div className="app-main">
                    <div className="app-title">{app.job?.title || 'Job Title'}</div>
                    <div className="app-company">{app.job?.company}</div>
                    <div className="app-meta">
                      <span>{app.job?.location}</span>
                      <span>·</span>
                      <span className="capitalize">{app.job?.type}</span>
                      <span>·</span>
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="app-right">
                    <span className={`badge ${cfg.color}`}><cfg.icon size={12} />{cfg.label}</span>
                    {app.interviewDate && (
                      <div className="interview-date">
                        📅 {new Date(app.interviewDate).toLocaleDateString()}
                      </div>
                    )}
                    {app.aiScore > 0 && (
                      <div className="ai-score">
                        <Sparkles size={12} /> AI Score: {app.aiScore}%
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Saved Jobs */}
        {activeTab === 'saved' && (
          <div className="applications-list">
            {savedJobs.length === 0 ? (
              <div className="empty-state card">
                <Bookmark size={40} className="empty-icon-svg" />
                <h3>No saved jobs</h3>
                <p>Save jobs you're interested in to find them here</p>
                <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
              </div>
            ) : savedJobs.map(job => (
              <div key={job._id} className="application-item card">
                <div className="app-company-logo"><Briefcase size={18} /></div>
                <div className="app-main">
                  <div className="app-title">{job.title}</div>
                  <div className="app-company">{job.company}</div>
                  <div className="app-meta"><span>{job.location}</span><span>·</span><span className="capitalize">{job.type}</span></div>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm">
                  View <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
