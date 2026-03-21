import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles, Loader2, Plus, X, ArrowLeft } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import './PostJobPage.css'

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Finance', 'Data Science', 'Product', 'Sales', 'HR', 'Operations', 'Legal']
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote']
const EXPERIENCE_LEVELS = ['fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years']

export default function PostJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', company: user?.company?.name || '',
    companyLogo: '', location: '', type: 'full-time', category: 'Engineering',
    experience: 'fresher', salaryMin: '', salaryMax: '',
    deadline: '', requirements: [], responsibilities: [], skills: [],
    featured: false,
  })
  const [skillInput, setSkillInput] = useState('')
  const [reqInput, setReqInput] = useState('')
  const [respInput, setRespInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get(`/jobs/${id}`).then(r => {
        const j = r.data
        setForm({ ...j, salaryMin: j.salaryMin || '', salaryMax: j.salaryMax || '', deadline: j.deadline ? j.deadline.slice(0, 10) : '' })
      })
    }
  }, [id])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addItem = (key, val, setter) => {
    if (!val.trim()) return
    setForm(f => ({ ...f, [key]: [...(f[key] || []), val.trim()] }))
    setter('')
  }

  const removeItem = (key, idx) => setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }))

  const aiImprove = async () => {
    if (!form.title || !form.description) { toast.error('Please enter title and description first'); return }
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/improve-job', {
        title: form.title, description: form.description, requirements: form.requirements
      })
      setForm(f => ({ ...f, description: data.description, requirements: data.requirements || [], responsibilities: data.responsibilities || [] }))
      toast.success('Job description improved by AI! ✨')
    } catch { toast.error('AI improve failed. Check your OpenAI key.') }
    finally { setAiLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/jobs/${id}`, form)
        toast.success('Job updated successfully!')
      } else {
        await api.post('/jobs', form)
        toast.success('Job posted successfully! 🎉')
      }
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job')
    } finally { setLoading(false) }
  }

  return (
    <div className="post-job-page page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
        <div className="post-job-header">
          <h1 className="page-title">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>
          <button type="button" className="ai-improve-btn" onClick={aiImprove} disabled={aiLoading}>
            {aiLoading ? <Loader2 size={16} className="spinner" /> : <Sparkles size={16} />}
            {aiLoading ? 'Improving with AI...' : 'AI Improve Description'}
          </button>
        </div>

        <form className="post-job-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-col">
              <div className="card form-section">
                <h2 className="form-section-title">Basic Information</h2>
                <div className="input-group">
                  <label className="input-label">Job Title *</label>
                  <input className="input" placeholder="e.g. Senior React Developer" value={form.title} onChange={e => set('title', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Company Name *</label>
                  <input className="input" placeholder="Your company name" value={form.company} onChange={e => set('company', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Company Logo URL</label>
                  <input className="input" placeholder="https://..." value={form.companyLogo} onChange={e => set('companyLogo', e.target.value)} />
                </div>
                <div className="form-row-2">
                  <div className="input-group">
                    <label className="input-label">Location *</label>
                    <input className="input" placeholder="e.g. Hyderabad / Remote" value={form.location} onChange={e => set('location', e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Category *</label>
                    <select className="input select" value={form.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="input-group">
                    <label className="input-label">Job Type</label>
                    <select className="input select" value={form.type} onChange={e => set('type', e.target.value)}>
                      {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Experience</label>
                    <select className="input select" value={form.experience} onChange={e => set('experience', e.target.value)}>
                      {EXPERIENCE_LEVELS.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="input-group">
                    <label className="input-label">Min Salary (₹)</label>
                    <input className="input" type="number" placeholder="e.g. 500000" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Max Salary (₹)</label>
                    <input className="input" type="number" placeholder="e.g. 1000000" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Application Deadline</label>
                  <input className="input" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                </div>
                <label className="featured-toggle">
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                  <span>Mark as Featured Job ⭐</span>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-col">
              <div className="card form-section">
                <h2 className="form-section-title">Job Details</h2>
                <div className="input-group">
                  <label className="input-label">Job Description *</label>
                  <textarea className="input textarea" rows={6} placeholder="Describe the role, team, and what you're looking for..." value={form.description} onChange={e => set('description', e.target.value)} required />
                </div>

                {/* Skills */}
                <div className="input-group">
                  <label className="input-label">Required Skills</label>
                  <div className="tag-input-row">
                    <input className="input" placeholder="e.g. React" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('skills', skillInput, setSkillInput))} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addItem('skills', skillInput, setSkillInput)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="tag-list">
                    {form.skills?.map((s, i) => (
                      <span key={i} className="skill-tag-form">{s} <button type="button" onClick={() => removeItem('skills', i)}><X size={11} /></button></span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="input-group">
                  <label className="input-label">Requirements</label>
                  <div className="tag-input-row">
                    <input className="input" placeholder="Add a requirement" value={reqInput} onChange={e => setReqInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', reqInput, setReqInput))} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addItem('requirements', reqInput, setReqInput)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="list-items">
                    {form.requirements?.map((r, i) => (
                      <div key={i} className="list-item-tag">{r} <button type="button" onClick={() => removeItem('requirements', i)}><X size={11} /></button></div>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="input-group">
                  <label className="input-label">Responsibilities</label>
                  <div className="tag-input-row">
                    <input className="input" placeholder="Add a responsibility" value={respInput} onChange={e => setRespInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('responsibilities', respInput, setRespInput))} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addItem('responsibilities', respInput, setRespInput)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="list-items">
                    {form.responsibilities?.map((r, i) => (
                      <div key={i} className="list-item-tag">{r} <button type="button" onClick={() => removeItem('responsibilities', i)}><X size={11} /></button></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-submit-row">
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <Loader2 size={16} className="spinner" /> : null}
              {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
