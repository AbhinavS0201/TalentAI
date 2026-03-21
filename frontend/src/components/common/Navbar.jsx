import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, User, Menu, X, Briefcase, LogOut, Settings, ChevronDown, Sparkles } from 'lucide-react'
import useAuthStore from '../../context/authStore'
import api from '../../utils/api'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const dropRef = useRef()
  const notifRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (user) fetchNotifications()
  }, [user])

  useEffect(() => {
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data.notifications)
      setUnread(data.unreadCount)
    } catch {}
  }

  const markRead = async () => {
    await api.put('/notifications/mark-read')
    setUnread(0)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <Sparkles size={20} className="logo-icon" />
          <span>Talent<span className="logo-accent">AI</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>Browse Jobs</Link>
          {user?.role === 'recruiter' && (
            <Link to="/post-job" className={`nav-link ${isActive('/post-job') ? 'active' : ''}`}>Post a Job</Link>
          )}
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              {/* Notifications */}
              <div className="notif-wrap" ref={notifRef}>
                <button className="icon-btn" onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markRead(); }}>
                  <Bell size={18} />
                  {unread > 0 && <span className="notif-badge">{unread}</span>}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown animate-fade">
                    <div className="notif-header">
                      <span>Notifications</span>
                      <span className="notif-count">{notifications.length}</span>
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <div className="notif-empty">No notifications yet</div>
                      ) : notifications.map(n => (
                        <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-msg">{n.message}</div>
                          <div className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="user-drop-wrap" ref={dropRef}>
                <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                  <div className="user-avatar">
                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`chev ${dropOpen ? 'open' : ''}`} />
                </button>
                {dropOpen && (
                  <div className="user-dropdown animate-fade">
                    <div className="drop-header">
                      <div className="drop-name">{user.name}</div>
                      <div className="drop-role badge badge-accent">{user.role}</div>
                    </div>
                    <div className="divider" />
                    <Link to="/profile" className="drop-item" onClick={() => setDropOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/dashboard" className="drop-item" onClick={() => setDropOpen(false)}>
                      <Briefcase size={15} /> Dashboard
                    </Link>
                    <div className="divider" />
                    <button className="drop-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu animate-fade">
          <Link to="/jobs" className="mobile-link" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user?.role === 'recruiter' && <Link to="/post-job" className="mobile-link" onClick={() => setMenuOpen(false)}>Post a Job</Link>}
          {user && <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {user && <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>}
          {user ? (
            <button className="mobile-link danger" onClick={handleLogout}>Sign Out</button>
          ) : (
            <div style={{display:'flex',gap:8,padding:'8px 0'}}>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
