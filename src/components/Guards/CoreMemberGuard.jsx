import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Shield, AlertCircle } from 'lucide-react'

const CoreMemberGuard = ({ children, requiredPermission = null }) => {
  const { user, loading, isUserCoreMember, checkPermission } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </motion.div>
      </div>
    )
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Check if user is a core member
  if (!isUserCoreMember()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <div className="glass-card p-8 rounded-xl text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This area is only accessible to CSI core members.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                    Core Member Access Only
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    You need to be a verified CSI core member to access this dashboard.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="btn-primary w-full"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Check specific permission if required
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <div className="glass-card p-8 rounded-xl text-center">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Insufficient Permissions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have the required permissions to access this feature.
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn-primary w-full"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // User is authorized
  return children
}

export default CoreMemberGuard
