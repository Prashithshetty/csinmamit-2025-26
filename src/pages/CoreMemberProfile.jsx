
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// Components
import ProfileHeader from '../components/CoreProfile/ProfileHeader'
import ProfileAvatar from '../components/CoreProfile/ProfileAvatar'
import ProfileForm from '../components/CoreProfile/ProfileForm'
import ProfileDisplay from '../components/CoreProfile/ProfileDisplay'
import StatsGrid from '../components/CoreProfile/StatsGrid'
import PermissionsSection from '../components/CoreProfile/PermissionsSection'

// Utils
import { getRoleCategory, getRoleColor, getStats } from '../utils/coreProfileUtils'

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

  // Event Handlers
  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateUserProfile({
      profile: {
        ...user?.profile,
        ...formData
      }
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Helper functions with proper binding
  const roleCategory = getRoleCategory(getUserRoleDisplay)
  const roleColor = getRoleColor(getRoleCategory, getUserRoleDisplay)
  const stats = getStats(getUserRoleDisplay)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-20">
      <div className="container-custom py-8">
        {/* Header */}
        <ProfileHeader />

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl overflow-hidden mb-8"
        >
          {/* Cover Section */}
          <div className={`h-32 bg-gradient-to-r ${roleColor}`} />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between -mt-16">
              {/* Avatar and Basic Info */}
              <ProfileAvatar 
                user={user}
                getUserRoleDisplay={getUserRoleDisplay}
                getRoleCategory={() => roleCategory}
              />

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
              <ProfileForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            ) : (
              <ProfileDisplay 
                user={user}
                formData={formData}
              />
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StatsGrid 
          stats={stats}
          getRoleColor={() => roleColor}
        />

        {/* Permissions Section */}
        <PermissionsSection 
          user={user}
          getUserRoleDisplay={getUserRoleDisplay}
          getRoleCategory={() => roleCategory}
        />
      </div>
    </div>
  )
}

export default CoreMemberProfile
