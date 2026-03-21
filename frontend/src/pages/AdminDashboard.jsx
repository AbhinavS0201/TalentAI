import { useState, useEffect } from 'react'
import { Users, Briefcase, FileText, TrendingUp, Loader2 } from 'lucide-react'
import api from '../utils/api'
import './Dashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/users/dashboard-stats'), api.get('/users/all')])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data); setLoading(false) })
      .catch(() => setLoading(false))
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
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="dash-sub">Platform overview and user management</p>
          </div>
        </div>

        <div className="stats-cards">
          {[
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'accent' },
            { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: 'blue' },
            { label: 'Applications', value: stats?.totalApplications || 0, icon: FileText, color: 'green' },
            { label: 'Platform Health', value: '99%', icon: TrendingUp, color: 'yellow' },
          ].map(s => (
            <div key={s.label} className="stat-item card">
              <div className={`stat-item-icon color-${s.color}`}><s.icon size={20} /></div>
              <div className="stat-item-value">{s.value}</div>
              <div className="stat-item-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="section-title">All Users</h2>
          <div className="users-table">
            <div className="table-header">
              <span>User</span><span>Role</span><span>Joined</span><span>Status</span>
            </div>
            {users.map(u => (
              <div key={u._id} className="table-row">
                <div className="table-user">
                  <div className="table-avatar">{u.avatar ? <img src={u.avatar} alt="" /> : u.name?.[0]}</div>
                  <div>
                    <div className="table-name">{u.name}</div>
                    <div className="table-email">{u.email}</div>
                  </div>
                </div>
                <span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'recruiter' ? 'badge-blue' : 'badge-green'}`}>{u.role}</span>
                <span className="table-date">{new Date(u.createdAt).toLocaleDateString()}</span>
                <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
