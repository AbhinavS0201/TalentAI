import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Filter, X, SlidersHorizontal, Loader2 } from 'lucide-react'
import api from '../utils/api'
import JobCard from '../components/jobs/JobCard'
import './JobsPage.css'

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote']
const EXPERIENCE_LEVELS = ['fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years']
const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Finance', 'Data Science', 'Product', 'Sales', 'HR', 'Operations', 'Legal']

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    type: '',
    experience: '',
    page: 1,
  })

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v) })
      params.append('limit', '12')
      const { data } = await api.get(`/jobs?${params}`)
      setJobs(data.jobs)
      setTotal(data.total)
      setPages(data.pages)
    } catch { setJobs([]) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({ search: '', location: '', category: '', type: '', experience: '', page: 1 })
  }

  const activeFilterCount = [filters.type, filters.experience, filters.category].filter(Boolean).length

  return (
    <div className="jobs-page page">
      <div className="container">
        {/* Search Header */}
        <div className="jobs-search-bar">
          <div className="search-field-jobs">
            <Search size={18} className="search-icon" />
            <input className="search-input" placeholder="Job title, skills, keywords..."
              value={filters.search} onChange={e => updateFilter('search', e.target.value)} />
            {filters.search && <button className="clear-x" onClick={() => updateFilter('search', '')}><X size={14} /></button>}
          </div>
          <div className="search-divider" />
          <div className="search-field-jobs">
            <MapPin size={18} className="search-icon" />
            <input className="search-input" placeholder="Location or remote..."
              value={filters.location} onChange={e => updateFilter('location', e.target.value)} />
          </div>
          <button className={`filter-toggle-btn ${activeFilterCount > 0 ? 'has-filters' : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="filters-panel animate-fade">
            <div className="filters-row">
              <div className="filter-group">
                <div className="filter-label">Job Type</div>
                <div className="filter-chips">
                  {JOB_TYPES.map(t => (
                    <button key={t} className={`chip ${filters.type === t ? 'active' : ''}`}
                      onClick={() => updateFilter('type', filters.type === t ? '' : t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <div className="filter-label">Experience</div>
                <div className="filter-chips">
                  {EXPERIENCE_LEVELS.map(e => (
                    <button key={e} className={`chip ${filters.experience === e ? 'active' : ''}`}
                      onClick={() => updateFilter('experience', filters.experience === e ? '' : e)}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <div className="filter-label">Category</div>
                <div className="filter-chips">
                  {CATEGORIES.map(c => (
                    <button key={c} className={`chip ${filters.category === c ? 'active' : ''}`}
                      onClick={() => updateFilter('category', filters.category === c ? '' : c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}

        <div className="jobs-results-header">
          <div className="results-count">
            {loading ? 'Searching...' : <><strong>{total}</strong> jobs found</>}
          </div>
          <div className="active-filters">
            {filters.type && <span className="active-chip">{filters.type} <button onClick={() => updateFilter('type', '')}><X size={10} /></button></span>}
            {filters.experience && <span className="active-chip">{filters.experience} <button onClick={() => updateFilter('experience', '')}><X size={10} /></button></span>}
            {filters.category && <span className="active-chip">{filters.category} <button onClick={() => updateFilter('category', '')}><X size={10} /></button></span>}
          </div>
        </div>

        {loading ? (
          <div className="jobs-loading">
            <Loader2 size={32} className="spinner" style={{ color: 'var(--accent)' }} />
            <p>Finding the best jobs for you...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="jobs-empty">
            <div className="empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="jobs-grid-full">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="pagination">
            <button className="btn btn-secondary btn-sm"
              disabled={filters.page === 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
              ← Previous
            </button>
            <div className="page-nums">
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-num ${filters.page === p ? 'active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, page: p }))}>
                  {p}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm"
              disabled={filters.page === pages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
