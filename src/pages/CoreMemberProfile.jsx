
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { PERMISSIONS, ROLE_CATEGORIES } from '../constants/coreMembers'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Award,
  Briefcase,
  Star,
  Edit,
  Camera,
  Save,
  X,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Users,
  Code,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CoreMemberProfile = () => {
  const { user, getUserRoleDisplay, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.profile?.phone || '',
    bio: user?.profile?.bio || '',
    branch: user?.profile?.branch || '',
    year: user?.profile?.year || '',
    skills: user?.profile?.skills || [],
    linkedin: user?.profile?.linkedin || '',
    github: user?.profile?.github || ''
  })

  // Get role category
  const getRoleCategory = () => {
    const role = getUserRoleDisplay()
    for (const [category, roles] of Object.entries(ROLE_CATEGORIES)) {
      if (roles.includes(role)) {
        return category
      }
    }
    return 'Team Member'
  }

  // Get role color
  const getRoleColor = () => {
    const category = getRoleCategory()
    const colors = {
      'Executive Board': 'from-purple-500 to-purple-600',
      'Technical': 'from-cyan-500 to-cyan-600',
      'Creative': 'from-pink-500 to-pink-600',
      'Events': 'from-green-500 to-green-600',
      'Marketing': 'from-orange-500 to-orange-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Update profile logic here
    await updateUserProfile({
      profile: {
        ...user?.profile,
        ...formData
      }
    })
    setIsEditing(false)
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Stats based on role
  const getStats = () => {
    const role = getUserRoleDisplay()
    if (role === 'President' || role === 'Vice President') {
      return [
        { label: 'Events Organized', value: '25', icon: Calendar },
        { label: 'Members Mentored', value: '50+', icon: Users },
        { label: 'Projects Led', value: '10', icon: Briefcase },
        { label: 'Achievement Points', value: '950', icon: Award }
      ]
    } else if (role.includes('Technical')) {
      return [
        { label: 'Projects Completed', value: '15', icon: Code },
        { label: 'Pull Requests', value: '45', icon: TrendingUp },
        { label: 'Issues Resolved', value: '30', icon: Target },
        { label: 'Tech Stack', value: '8+', icon: Star }
      ]
    } else {
      return [
        { label: 'Tasks Completed', value: '30', icon: CheckCircle },
        { label: 'Events Participated', value: '20', icon: Calendar },
        { label: 'Team Projects', value: '8', icon: Users },
        { label: 'Hours Contributed', value: '120+', icon: Clock }
      ]
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-20">
      <div className="container-custom py-8">
        {/* Header */}
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

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl overflow-hidden mb-8"
        >
          {/* Cover Section */}
          <div className={`h-32 bg-gradient-to-r ${getRoleColor()}`} />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between -mt-16">
              {/* Avatar and Basic Info */}
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

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <X size={18} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile Form/Display */}
            {isEditing ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.form>
            ) : (
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
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 bg-gradient-to-br ${getRoleColor()} rounded-lg`}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Permissions Section */}
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
      </div>
    </div>
  )
}

export default CoreMemberProfile
