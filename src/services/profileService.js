import { doc, updateDoc, getDoc, setDoc, serverTimestamp, arrayUnion } from 'firebase/firestore'
import { db } from '../config/firebase'
import { uploadToCloudinary } from '../config/cloudinary'

/**
 * Upload profile image to Cloudinary and update user document
 * @param {string} userId - User ID
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadProfileImage = async (userId, imageFile) => {
  if (!userId || !imageFile) {
    throw new Error('User ID and image file are required')
  }

  try {
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile, 'csi-profiles')
    
    if (!uploadResult.secure_url) {
      throw new Error('Failed to get image URL from Cloudinary')
    }

    // Store upload history in user document
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      photoURL: uploadResult.secure_url,
      'profile.imageHistory': arrayUnion({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        uploadedAt: new Date().toISOString(),
        format: uploadResult.format,
        size: uploadResult.bytes
      })
    })

    return uploadResult.secure_url
  } catch (error) {
    console.error('Error uploading profile image:', error)
    throw error
  }
}

/**
 * Update user profile in Firestore
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateUserProfile = async (userId, profileData) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    const userRef = doc(db, 'users', userId)
    
    // Check if user document exists
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      // Create new document if it doesn't exist
      await setDoc(userRef, {
        uid: userId,
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } else {
      // Update existing document
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      })
    }

    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

/**
 * Get user profile from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return userDoc.data()
    }
    
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

/**
 * Update profile with image upload
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data
 * @param {File} imageFile - Optional image file
 * @returns {Promise<Object>} - Updated profile data with image URL
 */
export const updateProfileWithImage = async (userId, profileData, imageFile = null) => {
  try {
    let photoURL = profileData.photoURL
    
    // Upload image if provided
    if (imageFile) {
      photoURL = await uploadProfileImage(userId, imageFile)
    }
    
    // Prepare update data
    const updateData = {
      name: profileData.name,
      photoURL: photoURL,
      profile: {
        usn: profileData.usn || '',
        phone: profileData.phone || '',
        role: profileData.role || '',
        bio: profileData.bio || '',
        branch: profileData.branch || '',
        year: profileData.year || '',
        skills: profileData.skills || [],
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        updatedAt: serverTimestamp()
      }
    }
    
    // Also update roleDetails if role is provided
    if (profileData.role) {
      updateData.roleDetails = {
        position: profileData.role,
        updatedAt: serverTimestamp()
      }
    }
    
    // Update profile in Firestore
    await updateUserProfile(userId, updateData)
    
    return {
      ...updateData,
      photoURL
    }
  } catch (error) {
    console.error('Error updating profile with image:', error)
    throw error
  }
}

/**
 * Validate profile data
 * @param {Object} profileData - Profile data to validate
 * @returns {Object} - Validation result
 */
export const validateProfileData = (profileData) => {
  const errors = {}
  
  // Required fields
  if (!profileData.name || profileData.name.trim() === '') {
    errors.name = 'Name is required'
  }
  
  // Phone validation
  if (profileData.phone) {
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(profileData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
  }
  
  // Year validation
  if (profileData.year) {
    const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni']
    if (!validYears.includes(profileData.year)) {
      errors.year = 'Please select a valid year'
    }
  }
  
  // URL validations
  if (profileData.linkedin && !profileData.linkedin.includes('linkedin.com')) {
    errors.linkedin = 'Please enter a valid LinkedIn URL'
  }
  
  if (profileData.github && !profileData.github.includes('github.com')) {
    errors.github = 'Please enter a valid GitHub URL'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
