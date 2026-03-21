// ApplicationsPage.jsx
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../context/authStore'
import JobSeekerDashboard from './JobSeekerDashboard'
import RecruiterDashboard from './RecruiterDashboard'

export default function ApplicationsPage() {
  const { user } = useAuthStore()
  if (user?.role === 'recruiter') return <RecruiterDashboard />
  return <JobSeekerDashboard />
}
