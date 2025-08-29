import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'

const ProfileDisplay = ({ user, formData }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 space-y-4"
    >
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
        </div>
        {formData.phone && (
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{formData.phone}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {formData.bio && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">{formData.bio}</p>
        </div>
      )}

      {/* Academic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.branch && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Branch</span>
            <p className="text-gray-900 dark:text-white font-medium">{formData.branch}</p>
          </div>
        )}
        {formData.year && (
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Year</span>
            <p className="text-gray-900 dark:text-white font-medium">{formData.year}</p>
          </div>
        )}
      </div>

      {/* Social Links */}
      {(formData.linkedin || formData.github) && (
        <div className="flex space-x-4">
          {formData.linkedin && (
            <a
              href={formData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              LinkedIn →
            </a>
          )}
          {formData.github && (
            <a
              href={formData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              GitHub →
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ProfileDisplay
