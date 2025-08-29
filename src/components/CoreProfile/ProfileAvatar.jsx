import { Camera, Sparkles } from 'lucide-react'

const ProfileAvatar = ({ user, getUserRoleDisplay, getRoleCategory }) => {
  return (
    <div className="flex items-center space-x-4 mb-4 md:mb-0">
      <div className="relative">
        <img
          src={user?.photoURL || '/default-avatar.png'}
          alt={user?.name}
          className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
        />
        <button className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-colors">
          <Camera size={16} />
        </button>
      </div>
      <div className="mt-16 md:mt-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user?.name}
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Sparkles size={14} className="mr-1" />
            {getUserRoleDisplay()}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getRoleCategory()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileAvatar
