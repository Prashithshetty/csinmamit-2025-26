import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { motion } from 'framer-motion'

const AdminGuard = ({ children }) => {
  const { adminUser, loading } = useAdminAuth()
  const location = useLocation()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Redirect to admin login if not authenticated
  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if session is valid
  const sessionData = localStorage.getItem('adminSession')
  if (!sessionData) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const session = JSON.parse(sessionData)
  if (Date.now() > session.expiry) {
    localStorage.removeItem('adminSession')
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Render children if authenticated
  return children
}

export default AdminGuard
