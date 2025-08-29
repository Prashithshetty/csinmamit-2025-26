import { motion } from 'framer-motion'
import { PERMISSIONS } from '../../config/coreMembers'

const PermissionsSection = ({ user, getUserRoleDisplay, getRoleCategory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-xl"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Your Permissions & Responsibilities
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Access Permissions
          </h4>
          <div className="flex flex-wrap gap-2">
            {user?.roleDetails?.permissions?.map(permission => (
              <span
                key={permission}
                className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-xs font-medium text-yellow-800 dark:text-yellow-400"
              >
                {PERMISSIONS[permission] || permission}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Position</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getUserRoleDisplay()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getRoleCategory()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.roleDetails?.level || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PermissionsSection
