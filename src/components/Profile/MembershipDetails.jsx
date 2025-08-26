import { motion } from 'framer-motion'

const MembershipDetails = ({ membershipStatus, membershipType, membershipExpiry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl p-6 mt-6"
    >
      <h3 className="text-xl font-semibold mb-4">Membership Details</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <p className="font-semibold capitalize">{membershipStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
            <p className="font-semibold">{membershipType}</p>
          </div>
          {membershipExpiry && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
              <p className="font-semibold">
                {new Date(membershipExpiry).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        {membershipStatus === 'inactive' && (
          <button className="w-full btn-primary">
            Activate Membership
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default MembershipDetails
