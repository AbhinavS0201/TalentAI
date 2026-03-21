import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Building2 } from 'lucide-react'
import { useState } from 'react'
import api from '../../utils/api'
import useAuthStore from '../../context/authStore'
import toast from 'react-hot-toast'
import './JobCard.css'

const TYPE_COLORS = {
  'full-time': 'badge-green', 'part-time': 'badge-blue',
  'contract': 'badge-yellow', 'internship': 'badge-accent', 'remote': 'badge-accent'
}

export default function JobCard({ job, showSave = true }) {
  const { user } = useAuthStore()
  const [saved, setSaved] = useState(user?.savedJobs?.includes(job._id))
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to save jobs'); return }
    if (user.role !== 'jobseeker') return
    setSaving(true)
    try {
      const { data } = await api.post(`/jobs/${job._id}/save`)
      setSaved(data.saved)
      toast.success(data.saved ? 'Job saved!' : 'Removed from saved')
    } catch { toast.error('Failed to save job') }
    finally { setSaving(false) }
  }

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Salary not disclosed'
    const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`
    if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} - ${fmt(job.salaryMax)}`
    return fmt(job.salaryMin || job.salaryMax)
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days/7)}w ago`
    return `${Math.floor(days/30)}mo ago`
  }

  return (
    <Link to={`/jobs/${job._id}`} className="job-card card card-hover">
      <div className="job-card-top">
        <div className="company-logo">
          {job.companyLogo ? <img src={job.companyLogo} alt={job.company} /> : <Building2 size={22} />}
        </div>
        <div className="job-card-meta">
          <span className={`badge ${TYPE_COLORS[job.type] || 'badge-gray'}`}>{job.type}</span>
          {job.featured && <span className="badge badge-yellow">⭐ Featured</span>}
        </div>
        {showSave && user?.role === 'jobseeker' && (
          <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={handleSave} disabled={saving}>
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      <h3 className="job-title">{job.title}</h3>
      <div className="company-name">{job.company}</div>

      <div className="job-card-info">
        <div className="info-item"><MapPin size={13} />{job.location}</div>
        <div className="info-item"><DollarSign size={13} />{formatSalary()}</div>
        <div className="info-item"><Clock size={13} />{timeAgo(job.createdAt)}</div>
      </div>

      {job.skills?.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 3).map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {job.skills.length > 3 && <span className="skill-more">+{job.skills.length - 3}</span>}
        </div>
      )}

      <div className="job-card-footer">
        <span className="applicants-count">{job.applicants?.length || 0} applicants</span>
        <span className="apply-link">View Job →</span>
      </div>
    </Link>
  )
}
