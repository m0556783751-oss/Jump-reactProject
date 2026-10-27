import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function StaffRoute({ children }) {
  const { isStaff, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-green-pale border-t-green rounded-full animate-spin" />
      </div>
    )
  }

  if (!isStaff) return <Navigate to="/login" replace />

  return children
}

export default StaffRoute
