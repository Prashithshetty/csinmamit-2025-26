import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

/**
 * Custom hook for managing profile data and operations
 */
export const useProfile = () => {
  const { user, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'NMAMIT',
    branch: '',
    year: '',
    bio: ''
  })

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        college: user.profile?.college || 'NMAMIT',
        branch: user.profile?.branch || '',
        year: user.profile?.year || '',
        bio: user.profile?.bio || ''
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        college: user.profile?.college || 'NMAMIT',
        branch: user.profile?.branch || '',
        year: user.profile?.year || '',
        bio: user.profile?.bio || ''
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updates = {
        name: profileData.name,
        profile: {
          phone: profileData.phone,
          college: profileData.college,
          branch: profileData.branch,
          year: profileData.year,
          bio: profileData.bio
        }
      }
      
      const success = await updateUserProfile(updates)
      if (success) {
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return {
    profileData,
    isEditing,
    loading,
    handleEdit,
    handleCancel,
    handleSave,
    handleInputChange
  }
}
