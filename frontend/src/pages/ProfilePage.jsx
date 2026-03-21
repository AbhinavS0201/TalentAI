import { useState, useRef } from 'react'
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Upload, Plus, X, Save, Loader2, Camera } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '', bio: user?.bio || '',
    location: user?.location || '', phone: user?.phone || '',
    experience: user?.experience || '', education: user?.education || '',
    skills: user?.skills || [],
    company: { name: user?.company?.name || '', website: user?.company?.website || '', description: user?.company?.description || '' },
  })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const resumeRef = useRef()
  const avatarRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setCompany = (key, val) => setForm(f => ({ ...f, company: { ...f.company, [key]: val } }))

  const addSkill = () => {
    if (!skillInput.trim() || form.skills.includes(skillInput.trim())) return
    set('skills', [...form.skills, skillInput.trim()])
    setSkillInput('')
  }

  const removeSkill = (s) => set('skills', form.skills.filter(x => x !== s))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', form)
      updateUser(data)
      toast.success('Profile updated! ✅')
    } catch { toast.error('Failed to save profile') }
    finally { setSaving(false) }
  }

  const uploadResume = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('resume', file)
    try {
      const { data } = await api.post('/users/upload-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      updateUser({ resume: data.resume, resumeName: data.resumeName })
      toast.success('Resume uploaded! ✅')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const { data } = await api.post('/users/upload-avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      updateUser({ avatar: data.avatar })
      toast.success('Profile photo updated! ✅')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div className="profile-page page">
      <div className="container">
        <h1 className="page-title" style={{ marginBottom: 24 }}>My Profile</h1>

        <form onSubmit={handleSave} className="profile-layout">
          {/* Left */}
          <div className="profile-sidebar-col">
            <div className="card profile-avatar-card">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {user?.avatar ? <img src={user.avatar} alt="" /> : <User size={40} />}
                </div>
                <button type="button" className="avatar-edit-btn" onClick={() => avatarRef.current.click()}>
                  <Camera size={14} />
                </button>
                <input ref={avatarRef} type="file" accept="image/*" hidden onChange={uploadAvatar} />
              </div>
              <div className="profile-name">{user?.name}</div>
              <div className="profile-email">{user?.email}</div>
              <span className={`badge ${user?.role === 'recruiter' ? 'badge-blue' : user?.role === 'admin' ? 'badge-red' : 'badge-green'}`} style={{ margin: '4px auto 0' }}>
                {user?.role}
              </span>
            </div>

            {user?.role === 'jobseeker' && (
              <div className="card">
                <h3 className="form-section-title">Resume</h3>
                {user?.resume ? (
                  <div className="resume-uploaded">
                    <div className="resume-name">📄 {user.resumeName || 'Resume uploaded'}</div>
                    <a href={user.resume} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View</a>
                  </div>
                ) : (
                  <div className="resume-empty">No resume uploaded yet</div>
                )}
                <button type="button" className="btn btn-secondary w-full" style={{ marginTop: 12 }}
                  onClick={() => resumeRef.current.click()} disabled={uploading}>
                  {uploading ? <Loader2 size={15} className="spinner" /> : <Upload size={15} />}
                  {uploading ? 'Uploading...' : user?.resume ? 'Replace Resume' : 'Upload Resume'}
                </button>
                <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={uploadResume} />
                <div className="resume-hint">PDF, DOC, DOCX supported</div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="profile-main-col">
            <div className="card form-section" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
              <h2 className="form-section-title">Personal Information</h2>
              <div className="form-row-2p">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <div className="input-wrap"><User size={15} className="input-icon" />
                    <input className="input input-with-icon" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Phone</label>
                  <div className="input-wrap"><Phone size={15} className="input-icon" />
                    <input className="input input-with-icon" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 9999999999" />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Location</label>
                <div className="input-wrap"><MapPin size={15} className="input-icon" />
                  <input className="input input-with-icon" value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Bio</label>
                <textarea className="input textarea" rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell us about yourself..." />
              </div>
            </div>

            {user?.role === 'jobseeker' && (
              <div className="card form-section" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
                <h2 className="form-section-title">Professional Details</h2>
                <div className="input-group">
                  <label className="input-label">Experience</label>
                  <div className="input-wrap"><Briefcase size={15} className="input-icon" />
                    <input className="input input-with-icon" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 2 years in React, Node.js" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Education</label>
                  <div className="input-wrap"><GraduationCap size={15} className="input-icon" />
                    <input className="input input-with-icon" value={form.education} onChange={e => set('education', e.target.value)} placeholder="e.g. B.Tech CSE, XYZ University" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Skills</label>
                  <div className="tag-input-row">
                    <input className="input" placeholder="Add a skill (press Enter)" value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addSkill}><Plus size={14} /></button>
                  </div>
                  <div className="tag-list">
                    {form.skills.map(s => (
                      <span key={s} className="skill-tag-form">{s}
                        <button type="button" onClick={() => removeSkill(s)}><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'recruiter' && (
              <div className="card form-section" style={{ gap: 16, display: 'flex', flexDirection: 'column' }}>
                <h2 className="form-section-title">Company Information</h2>
                <div className="input-group">
                  <label className="input-label">Company Name</label>
                  <input className="input" value={form.company.name} onChange={e => setCompany('name', e.target.value)} placeholder="Your Company" />
                </div>
                <div className="input-group">
                  <label className="input-label">Company Website</label>
                  <input className="input" value={form.company.website} onChange={e => setCompany('website', e.target.value)} placeholder="https://yourcompany.com" />
                </div>
                <div className="input-group">
                  <label className="input-label">Company Description</label>
                  <textarea className="input textarea" rows={3} value={form.company.description} onChange={e => setCompany('description', e.target.value)} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 40 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
