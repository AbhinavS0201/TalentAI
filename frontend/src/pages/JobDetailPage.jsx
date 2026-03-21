import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Briefcase, Building2, Users, Eye, Star, Sparkles, Loader2, Send, BookmarkCheck, Bookmark, ArrowLeft, CheckCircle } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import './JobDetailPage.css'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => { setJob(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  const generateCoverLetter = async () => {
    if (!user) { toast.error('Please login first'); return }
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/cover-letter', {
        jobTitle: job.title, company: job.company,
        jobDescription: job.description,
        userSkills: user.skills, userExperience: user.experience, userName: user.name,
      })
      setCoverLetter(data.coverLetter)
      toast.success('AI cover letter generated! ✨')
    } catch { toast.error('AI generation failed. Please add your OpenAI key.') }
    finally { setAiLoading(false) }
  }

  const handleApply = async () => {
    if (!user) { toast.error('Please login to apply'); navigate('/login'); return }
    if (!user.resume) { toast.error('Please upload your resume in your profile first'); return }
    setApplying(true)
    try {
      await api.post('/applications', { jobId: job._id, coverLetter })
      setApplied(true)
      setShowApply(false)
      toast.success('Application submitted successfully! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally { setApplying(false) }
  }

  const handleSave = async () => {
    if (!user) { toast.error('Please login to save jobs'); return }
    try {
      const { data } = await api.post(`/jobs/${id}/save`)
      setSaved(data.saved)
      toast.success(data.saved ? 'Job saved!' : 'Removed from saved')
    } catch { toast.error('Failed to save') }
  }

  const formatSalary = () => {
    if (!job?.salaryMin && !job?.salaryMax) return 'Salary not disclosed'
    const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`
    if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)} / year`
    return fmt(job.salaryMin || job.salaryMax)
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Loader2 size={32} className="spinner" style={{ color: 'var(--accent)' }} />
    </div>
  )

  if (!job) return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <h2>Job not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Browse Jobs</button>
    </div>
  )

  return (
    <div className="job-detail-page page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>

        <div className="job-detail-layout">
          {/* Main Content */}
          <div className="job-detail-main">
            {/* Header */}
            <div className="job-detail-header card">
              <div className="jd-company-row">
                <div className="jd-logo">
                  {job.companyLogo ? <img src={job.companyLogo} alt={job.company} /> : <Building2 size={28} />}
                </div>
                <div className="jd-company-info">
                  <div className="jd-company">{job.company}</div>
                  {job.postedBy?.company?.website && (
                    <a href={job.postedBy.company.website} target="_blank" rel="noreferrer" className="jd-website">
                      {job.postedBy.company.website}
                    </a>
                  )}
                </div>
                {job.featured && <span className="badge badge-yellow"><Star size={12} /> Featured</span>}
              </div>
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-tags">
                <span className={`badge ${job.type === 'full-time' ? 'badge-green' : job.type === 'remote' ? 'badge-accent' : 'badge-blue'}`}>{job.type}</span>
                <span className="badge badge-gray">{job.experience}</span>
                {job.category && <span className="badge badge-gray">{job.category}</span>}
              </div>
              <div className="jd-meta-grid">
                <div className="jd-meta-item"><MapPin size={15} /><span>{job.location}</span></div>
                <div className="jd-meta-item"><DollarSign size={15} /><span>{formatSalary()}</span></div>
                <div className="jd-meta-item"><Users size={15} /><span>{job.applicants?.length || 0} applicants</span></div>
                <div className="jd-meta-item"><Eye size={15} /><span>{job.views || 0} views</span></div>
              </div>
              {job.deadline && (
                <div className="jd-deadline">
                  <Clock size={14} /> Apply before: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="jd-section-title">Job Description</h2>
              <p className="jd-description">{job.description}</p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div className="card">
                <h2 className="jd-section-title">Responsibilities</h2>
                <ul className="jd-list">
                  {job.responsibilities.map((r, i) => (
                    <li key={i}><CheckCircle size={15} className="list-icon" />{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="card">
                <h2 className="jd-section-title">Requirements</h2>
                <ul className="jd-list">
                  {job.requirements.map((r, i) => (
                    <li key={i}><CheckCircle size={15} className="list-icon" />{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills?.length > 0 && (
              <div className="card">
                <h2 className="jd-section-title">Required Skills</h2>
                <div className="jd-skills">
                  {job.skills.map(s => <span key={s} className="skill-tag-lg">{s}</span>)}
                </div>
              </div>
            )}

            {/* Apply Modal */}
            {showApply && (
              <div className="apply-section card animate-fade">
                <div className="apply-header">
                  <h2 className="jd-section-title" style={{ margin: 0 }}>Apply for this Job</h2>
                  <button className="ai-gen-btn" onClick={generateCoverLetter} disabled={aiLoading}>
                    {aiLoading ? <Loader2 size={15} className="spinner" /> : <Sparkles size={15} />}
                    {aiLoading ? 'Generating...' : 'AI Generate Cover Letter'}
                  </button>
                </div>
                {aiLoading && (
                  <div className="ai-loading-bar">
                    <div className="ai-loading-fill" />
                  </div>
                )}
                <div className="input-group">
                  <label className="input-label">Cover Letter</label>
                  <textarea
                    className="input textarea" rows={8} placeholder="Write your cover letter or use AI to generate one..."
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                  />
                </div>
                <div className="apply-footer-btns">
                  <button className="btn btn-secondary" onClick={() => setShowApply(false)}>Cancel</button>
                  <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={applying}>
                    {applying ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="job-detail-sidebar">
            <div className="card sidebar-actions">
              {applied ? (
                <div className="applied-msg">
                  <CheckCircle size={24} className="applied-icon" />
                  <div className="applied-title">Application Sent!</div>
                  <div className="applied-sub">We'll notify you of any updates</div>
                </div>
              ) : (
                <>
                  {user?.role === 'jobseeker' && (
                    <button className="btn btn-primary w-full btn-lg" onClick={() => setShowApply(true)}>
                      <Send size={16} /> Apply Now
                    </button>
                  )}
                  {!user && (
                    <button className="btn btn-primary w-full btn-lg" onClick={() => navigate('/login')}>
                      Login to Apply
                    </button>
                  )}
                </>
              )}
              {user?.role === 'jobseeker' && (
                <button className={`btn w-full ${saved ? 'btn-success' : 'btn-secondary'}`} onClick={handleSave}>
                  {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  {saved ? 'Saved' : 'Save Job'}
                </button>
              )}
            </div>

            <div className="card">
              <h3 className="sidebar-title">Job Overview</h3>
              <div className="overview-list">
                <div className="overview-item"><span className="ov-label">Posted</span><span>{new Date(job.createdAt).toLocaleDateString()}</span></div>
                <div className="overview-item"><span className="ov-label">Job Type</span><span className="capitalize">{job.type}</span></div>
                <div className="overview-item"><span className="ov-label">Experience</span><span>{job.experience}</span></div>
                <div className="overview-item"><span className="ov-label">Category</span><span>{job.category}</span></div>
                <div className="overview-item"><span className="ov-label">Location</span><span>{job.location}</span></div>
              </div>
            </div>

            {job.postedBy && (
              <div className="card">
                <h3 className="sidebar-title">Posted By</h3>
                <div className="recruiter-info">
                  <div className="recruiter-avatar">
                    {job.postedBy.avatar ? <img src={job.postedBy.avatar} alt={job.postedBy.name} /> : job.postedBy.name?.[0]}
                  </div>
                  <div>
                    <div className="recruiter-name">{job.postedBy.name}</div>
                    <div className="recruiter-role">Recruiter</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
