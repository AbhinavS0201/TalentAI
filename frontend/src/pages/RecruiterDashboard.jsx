import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, Eye, Plus, TrendingUp, ChevronRight, Sparkles, Loader2, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import './Dashboard.css'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected']
const STATUS_COLORS = { pending: 'badge-yellow', reviewed: 'badge-blue', shortlisted: 'badge-accent', interview: 'badge-green', offered: 'badge-green', rejected: 'badge-red' }

export default function RecruiterDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('jobs')
  const [loading, setLoading] = useState(true)
  const [aiScoring, setAiScoring] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/users/dashboard-stats'),
      api.get('/jobs/my-jobs'),
      api.get('/applications/all'),
    ]).then(([s, j, a]) => {
      setStats(s.data)
      setJobs(j.data)
      setApplications(a.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status })
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a))
      toast.success(`Status updated to ${status}`)
    } catch { toast.error('Failed to update') }
  }

  const scoreResume = async (app) => {
    setAiScoring(app._id)
    try {
      const { data } = await api.post('/ai/score-resume', { jobId: app.job._id, applicationId: app._id })
      setApplications(prev => prev.map(a => a._id === app._id ? { ...a, aiScore: data.score, aiAnalysis: JSON.stringify(data) } : a))
      toast.success(`AI Score: ${data.score}% — ${data.verdict}`)
    } catch { toast.error('AI scoring failed. Check your OpenAI key.') }
    finally { setAiScoring(null) }
  }

  const toggleJob = async (jobId, current) => {
    await api.put(`/jobs/${jobId}`, { isActive: !current })
    setJobs(prev => prev.map(j => j._id === jobId ? { ...j, isActive: !current } : j))
    toast.success(!current ? 'Job activated' : 'Job deactivated')
  }

  const deleteJob = async (jobId) => {
    if (!confirm('Delete this job?')) return
    await api.delete(`/jobs/${jobId}`)
    setJobs(prev => prev.filter(j => j._id !== jobId))
    toast.success('Job deleted')
  }

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
            <h1 className="page-title">Recruiter Dashboard</h1>
            <p className="dash-sub">Manage jobs and review applications</p>
          </div>
          <Link to="/post-job" className="btn btn-primary"><Plus size={16} /> Post New Job</Link>
        </div>

        <div className="stats-cards">
          {[
            { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, color: 'accent' },
            { label: 'Total Applications', value: stats?.totalApplications || 0, icon: Users, color: 'blue' },
            { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: CheckCircle, color: 'green' },
            { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'yellow' },
          ].map(s => (
            <div key={s.label} className="stat-item card">
              <div className={`stat-item-icon color-${s.color}`}><s.icon size={20} /></div>
              <div className="stat-item-value">{s.value}</div>
              <div className="stat-item-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dash-tabs">
          {[
            { id: 'jobs', label: `My Jobs (${jobs.length})` },
            { id: 'applications', label: `Applications (${applications.length})` },
          ].map(t => (
            <button key={t.id} className={`dash-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'jobs' && (
          <div className="applications-list">
            {jobs.length === 0 ? (
              <div className="empty-state card">
                <Briefcase size={40} className="empty-icon-svg" />
                <h3>No jobs posted yet</h3>
                <Link to="/post-job" className="btn btn-primary"><Plus size={16} /> Post Your First Job</Link>
              </div>
            ) : jobs.map(job => (
              <div key={job._id} className="application-item card">
                <div className="app-main">
                  <div className="app-title">{job.title}</div>
                  <div className="app-meta">
                    <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Inactive'}</span>
                    <span>·</span><span>{job.applicants?.length || 0} applicants</span>
                    <span>·</span><span>{job.views || 0} views</span>
                    <span>·</span><span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="app-right" style={{ flexDirection: 'row', gap: 8 }}>
                  <Link to={`/edit-job/${job._id}`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-secondary btn-sm" onClick={() => toggleJob(job._id, job.isActive)}>
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-list">
            {applications.length === 0 ? (
              <div className="empty-state card">
                <Users size={40} className="empty-icon-svg" />
                <h3>No applications yet</h3>
                <p>Post jobs to start receiving applications</p>
              </div>
            ) : applications.map(app => (
              <div key={app._id} className="application-item card application-item-recruiter">
                <div className="applicant-avatar">
                  {app.applicant?.avatar ? <img src={app.applicant.avatar} alt="" /> : app.applicant?.name?.[0]}
                </div>
                <div className="app-main">
                  <div className="app-title">{app.applicant?.name}</div>
                  <div className="app-company">{app.job?.title} at {app.job?.company}</div>
                  <div className="app-meta">
                    <span>{app.applicant?.email}</span>
                    {app.aiScore > 0 && <span className="ai-score-badge"><Sparkles size={11} /> {app.aiScore}% match</span>}
                  </div>
                </div>
                <div className="app-right">
                  <select className="status-select"
                    value={app.status}
                    onChange={e => updateStatus(app._id, e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                  {app.applicant?.resume && (
                    <a href={app.applicant.resume} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Resume</a>
                  )}
                  <button className="btn btn-secondary btn-sm ai-score-btn" onClick={() => scoreResume(app)} disabled={aiScoring === app._id}>
                    {aiScoring === app._id ? <Loader2 size={13} className="spinner" /> : <Sparkles size={13} />}
                    AI Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
