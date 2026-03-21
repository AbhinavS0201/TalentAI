import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './context/authStore'
import Navbar from './components/common/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage'
import PostJobPage from './pages/PostJobPage'
import ApplicationsPage from './pages/ApplicationsPage'
import NotFoundPage from './pages/NotFoundPage'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute roles={['recruiter','admin']}><PostJobPage /></ProtectedRoute>} />
          <Route path="/edit-job/:id" element={<ProtectedRoute roles={['recruiter','admin']}><PostJobPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e1e28', color: '#f0f0ff', border: '1px solid #2a2a38', fontFamily: 'DM Sans, sans-serif' },
          success: { iconTheme: { primary: '#22d3a0', secondary: '#0a0a0f' } },
          error: { iconTheme: { primary: '#ff5e7a', secondary: '#0a0a0f' } },
        }} />
      </div>
    </BrowserRouter>
  )
}

function DashboardRouter() {
  const { user } = useAuthStore()
  if (user?.role === 'recruiter') return <RecruiterDashboard />
  if (user?.role === 'admin') return <AdminDashboard />
  return <JobSeekerDashboard />
}
