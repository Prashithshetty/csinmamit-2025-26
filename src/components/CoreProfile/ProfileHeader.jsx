import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProfileHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Core Member Profile
        </h1>
        <Link
          to="/dashboard"
          className="btn-secondary flex items-center space-x-2"
        >
          <Shield size={18} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </motion.div>
  )
}

export default ProfileHeader
