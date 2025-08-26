import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import ProfileStats from './ProfileStats'

const ProfileCard = ({ user, membershipStatus, membershipType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="glass-card rounded-xl p-6 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <img
            src={user.photoURL || '/default-avatar.png'}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>

        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>

        {/* Membership Badge */}
        <div className="mb-6">
          {membershipStatus === 'active' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CheckCircle size={16} />
              <span className="font-medium">{membershipType} Member</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <AlertCircle size={16} />
              <span className="font-medium">Inactive Member</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <ProfileStats />
      </div>
    </motion.div>
  )
}

export default ProfileCard
