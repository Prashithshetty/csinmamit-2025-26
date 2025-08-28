import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const UserGuard = ({ children }) => {
  const { user, loading } = useAuth()
  const { adminUser } = useAdminAuth()
  
  // If user is an admin, redirect to admin dashboard
  if (adminUser) {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  // If not loading and no user, redirect to home
  if (!loading && !user) {
    return <Navigate to="/" replace />
  }
  
  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return children
}

export default UserGuard
