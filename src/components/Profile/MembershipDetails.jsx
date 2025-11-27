import { motion } from 'framer-motion'

const MembershipDetails = ({ membershipStatus, membershipType, membershipExpiry }) => {
  const planNames = {
    '1year': '1-Year Executive Membership',
    '2year': '2-Year Executive Membership',
    '3year': '3-Year Executive Membership'
  };

  const displayType = planNames[membershipType] || membershipType || 'Standard Member';
  const status = membershipStatus || 'inactive';

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
            <p className={`font-semibold capitalize ${status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
              {status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
            <p className="font-semibold">{displayType}</p>
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

        {status === 'inactive' && (
          <button className="w-full btn-primary" onClick={() => window.location.href = '/recruit'}>
            Activate Membership
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default MembershipDetails
