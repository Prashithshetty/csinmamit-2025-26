import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

/**
 * Custom hook for managing profile data with Firestore
 */
export const useProfileFirestore = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'NMAMIT',
    branch: '',
    year: '',
    bio: '',
    usn: '',
    github: '',
    linkedin: ''
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  // Fetch profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const data = userSnap.data()
          const profile = {
            name: data.name || user.name || '',
            email: data.email || user.email || '',
            phone: data.phone || data.profile?.phone || '',
            college: data.profile?.college || 'NMAMIT',
            branch: data.branch || data.profile?.branch || '',
            year: data.profile?.year || '',
            bio: data.bio || data.profile?.bio || '',
            usn: data.usn || '',
            github: data.github || '',
            linkedin: data.linkedin || ''
          }
          setProfileData(profile)
          setOriginalData(profile)
        } else {
          // New user: preload with auth info
          const profile = {
            name: user.name || user.displayName || '',
            email: user.email || '',
            phone: '',
            college: 'NMAMIT',
            branch: '',
            year: '',
            bio: '',
            usn: '',
            github: '',
            linkedin: ''
          }
          setProfileData(profile)
          setOriginalData(profile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Save profile to Firestore
  const handleSave = async () => {
    if (!user?.uid) {
      toast.error('User not authenticated')
      return
    }

    setLoading(true)
    try {
      const userRef = doc(db, 'users', user.uid)
      
      // Get existing document to preserve fields we don't update
      const existingDoc = await getDoc(userRef)
      const existingData = existingDoc.exists() ? existingDoc.data() : {}
      
      // Prepare the update data according to Firestore rules
      const updateData = {
        // Core fields that match Firestore rules
        name: profileData.name || '',
        bio: profileData.bio || null,
        branch: profileData.branch || null,
        usn: profileData.usn || null,
        github: profileData.github || null,
        linkedin: profileData.linkedin || null,
        phone: profileData.phone || null,
        
        // Preserve existing fields
        email: existingData.email || user.email || profileData.email,
        role: existingData.role || 'member',
        certificates: existingData.certificates || [],
        
        // Also update the nested profile object for backward compatibility
        profile: {
          phone: profileData.phone || '',
          college: profileData.college || 'NMAMIT',
          branch: profileData.branch || '',
          year: profileData.year || '',
          bio: profileData.bio || ''
        },
        
        // Timestamps
        updatedAt: serverTimestamp()
      }
      
      // Add createdAt only if it's a new document
      if (!existingDoc.exists()) {
        updateData.createdAt = serverTimestamp()
      }

      // Update Firestore document
      await setDoc(userRef, updateData, { merge: true })
      
      setOriginalData(profileData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please make sure you are logged in.')
      } else if (error.code === 'unavailable') {
        toast.error('Service temporarily unavailable. Please try again later.')
      } else {
        toast.error('Failed to save profile. Please check your data and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Enable edit mode
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Cancel editing and restore original data
  const handleCancel = () => {
    setIsEditing(false)
    if (originalData) {
      setProfileData(originalData)
    }
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
