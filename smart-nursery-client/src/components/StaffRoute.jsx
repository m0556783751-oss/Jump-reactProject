import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './StaffRoute.css'

function StaffRoute({ children }) {
  const { isStaff, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="staff-route-loading">
        <div className="staff-route-spinner" />
      </div>
    )
  }

  if (!isStaff) return <Navigate to="/login" replace />

  return children
}

export default StaffRoute
