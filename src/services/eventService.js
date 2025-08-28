import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'csi-events'

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder path in Cloudinary (e.g., 'csi-events/2024')
 * @returns {Promise<string>} - Cloudinary URL of uploaded image
 */
export const uploadToCloudinary = async (file, folder = 'csi-events') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

/**
 * Create a new event
 * @param {Object} eventData - Event data object
 * @param {File} imageFile - Event poster image file (optional if cloudinaryUrl is provided)
 * @returns {Promise<string>} - ID of created event
 */
export const createEvent = async (eventData, imageFile) => {
  try {
    let cloudinaryUrl = ''
    
    // Check if cloudinaryUrl is already provided in eventData
    if (eventData.cloudinaryUrl) {
      cloudinaryUrl = eventData.cloudinaryUrl
    } else if (imageFile) {
      // Upload image to Cloudinary if file is provided
      const folder = `csi-events/${eventData.year || new Date().getFullYear()}`
      cloudinaryUrl = await uploadToCloudinary(imageFile, folder)
    }

    // Prepare event data for Firestore
    const eventDoc = {
      ...eventData,
      image: cloudinaryUrl,
      cloudinaryUrl: cloudinaryUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: eventData.published || false,
      featured: eventData.featured || false,
      participantCount: eventData.participantCount || 0,
      participants: eventData.participants || [],
      contactPersons: eventData.contactPersons || [],
      registrationsAvailable: eventData.registrationsAvailable || false,
      searchTitle: eventData.title?.toLowerCase() || '',
      searchDescription: eventData.description?.toLowerCase() || '',
      year: parseInt(eventData.year) || new Date().getFullYear()
    }

    // // Remove the cloudinaryUrl from eventDoc if it was passed in eventData
    // delete eventDoc.cloudinaryUrl

    console.log('Creating event with data:', eventDoc)

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'events'), eventDoc)
    console.log(docRef, 'Document written with ID: ', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error creating event:', error.message)
    console.log('Error creating event:', error.message)
    throw error
  }
}

/**
 * Update an existing event
 * @param {string} eventId - Event document ID
 * @param {Object} eventData - Updated event data
 * @param {File} imageFile - New event poster image file (optional if cloudinaryUrl is provided)
 * @returns {Promise<void>}
 */
export const updateEvent = async (eventId, eventData, imageFile) => {
  try {
    let updateData = { ...eventData }
    
    // Check if cloudinaryUrl is already provided in eventData
    if (eventData.cloudinaryUrl) {
      updateData.image = eventData.cloudinaryUrl
      // Remove the cloudinaryUrl field as we don't need to store it separately
      // delete updateData.cloudinaryUrl
    } else if (imageFile) {
      // Upload new image if file is provided
      const folder = `csi-events/${eventData.year || new Date().getFullYear()}`
      const cloudinaryUrl = await uploadToCloudinary(imageFile, folder)
      updateData.image = cloudinaryUrl
    }

    // Update Firestore document
    updateData.updatedAt = serverTimestamp()
    updateData.searchTitle = eventData.title?.toLowerCase() || ''
    updateData.searchDescription = eventData.description?.toLowerCase() || ''
    
    if (eventData.year) {
      updateData.year = parseInt(eventData.year)
    }

    const eventRef = doc(db, 'events', eventId)
    await updateDoc(eventRef, updateData)
  } catch (error) {
    console.error('Error updating event:', error)
    throw error
  }
}

/**
 * Delete an event
 * @param {string} eventId - Event document ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error
  }
}

/**
 * Get all events
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} - Array of events
 */
export const getAllEvents = async (filters = {}) => {
  try {
    let q = collection(db, 'events')
    
    // Apply filters
    if (filters.year) {
      q = query(q, where('year', '==', parseInt(filters.year)))
    }
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category))
    }
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status))
    }
    
    if (filters.published !== undefined) {
      q = query(q, where('published', '==', filters.published))
    }
    
    // Add ordering - simplified to avoid index requirements
    q = query(q, orderBy('createdAt', 'desc'))
    
    const snapshot = await getDocs(q)
    const events = []
    
    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

/**
 * Get a single event by ID
 * @param {string} eventId - Event document ID
 * @returns {Promise<Object>} - Event data
 */
export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId)
    const eventSnap = await getDoc(eventRef)
    
    if (eventSnap.exists()) {
      return {
        id: eventSnap.id,
        ...eventSnap.data()
      }
    } else {
      throw new Error('Event not found')
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    throw error
  }
}

/**
 * Toggle event published status
 * @param {string} eventId - Event document ID
 * @param {boolean} published - New published status
 * @returns {Promise<void>}
 */
export const toggleEventPublished = async (eventId, published) => {
  try {
    const eventRef = doc(db, 'events', eventId)
    await updateDoc(eventRef, {
      published,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error toggling event published status:', error)
    throw error
  }
}

/**
 * Get events by year for public display
 * @param {number} year - Year to filter events
 * @returns {Promise<Array>} - Array of published events
 */
export const getEventsByYear = async (year) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('year', '==', parseInt(year)),
      where('published', '==', true),
      orderBy('date', 'desc')
    )
    
    const snapshot = await getDocs(q)
    const events = []
    
    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return events
  } catch (error) {
    console.error('Error fetching events by year:', error)
    throw error
  }
}
