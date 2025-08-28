/**
 * Admin Event Utilities
 * Helper functions for event management in admin panel
 */

/**
 * Validate event form data
 * @param {Object} eventData - Event data to validate
 * @returns {Object} - Validation result with errors
 */
export const validateEventForm = (eventData) => {
  const errors = {}

  // Required fields
  if (!eventData.title || eventData.title.trim() === '') {
    errors.title = 'Event title is required'
  }

  if (!eventData.description || eventData.description.trim() === '') {
    errors.description = 'Event description is required'
  }

  if (!eventData.date) {
    errors.date = 'Event date is required'
  }

  if (!eventData.year) {
    errors.year = 'Event year is required'
  } else if (eventData.year < 2019 || eventData.year > 2030) {
    errors.year = 'Year must be between 2019 and 2030'
  }

  if (!eventData.venue || eventData.venue.trim() === '') {
    errors.venue = 'Event venue is required'
  }

  // Optional field validations
  if (eventData.entryFee && eventData.entryFee < 0) {
    errors.entryFee = 'Entry fee cannot be negative'
  }

  if (eventData.participantCount && eventData.participantCount < 0) {
    errors.participantCount = 'Participant count cannot be negative'
  }

  // Contact persons validation
  if (eventData.contactPersons && eventData.contactPersons.length > 0) {
    eventData.contactPersons.forEach((person, index) => {
      if (!person.name) {
        errors[`contactPerson_${index}_name`] = 'Contact person name is required'
      }
      if (!person.phone && !person.email) {
        errors[`contactPerson_${index}_contact`] = 'At least one contact method is required'
      }
      if (person.email && !isValidEmail(person.email)) {
        errors[`contactPerson_${index}_email`] = 'Invalid email format'
      }
      if (person.phone && !isValidPhone(person.phone)) {
        errors[`contactPerson_${index}_phone`] = 'Invalid phone number'
      }
    })
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Format event date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatEventDate = (date) => {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date'
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  
  return dateObj.toLocaleDateString('en-IN', options)
}

/**
 * Format event time for display
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Formatted time string
 */
export const formatEventTime = (time) => {
  if (!time) return 'N/A'
  
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Get event status badge color
 * @param {string} status - Event status
 * @returns {string} - Tailwind CSS classes for badge
 */
export const getEventStatusColor = (status) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    postponed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  
  return statusColors[status] || statusColors.draft
}

/**
 * Get event category badge color
 * @param {string} category - Event category
 * @returns {string} - Tailwind CSS classes for badge
 */
export const getEventCategoryColor = (category) => {
  const categoryColors = {
    UPCOMING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    PREVIOUS: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    ONGOING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  }
  
  return categoryColors[category] || categoryColors.PREVIOUS
}

/**
 * Get event type badge color
 * @param {string} type - Event type
 * @returns {string} - Tailwind CSS classes for badge
 */
export const getEventTypeColor = (type) => {
  const typeColors = {
    TEAM: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    INDIVIDUAL: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    WORKSHOP: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    SEMINAR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    COMPETITION: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    BOOTCAMP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
  
  return typeColors[type] || typeColors.TEAM
}

/**
 * Prepare event data for Firestore
 * @param {Object} formData - Form data from event form
 * @returns {Object} - Formatted data for Firestore
 */
export const prepareEventData = (formData) => {
  return {
    ...formData,
    title: formData.title.trim(),
    description: formData.description.trim(),
    brief: formData.brief?.trim() || '',
    venue: formData.venue.trim(),
    organizers: formData.organizers?.trim() || 'CSI NMAMIT',
    year: parseInt(formData.year),
    entryFee: parseFloat(formData.entryFee) || 0,
    participantCount: parseInt(formData.participantCount) || 0,
    searchTitle: formData.title.toLowerCase().trim(),
    searchDescription: formData.description.toLowerCase().trim(),
    contactPersons: formData.contactPersons || [],
    participants: formData.participants || [],
    tags: formData.tags || [],
    featured: formData.featured || false,
    published: formData.published || false,
    registrationsAvailable: formData.registrationsAvailable || false
  }
}

/**
 * Filter events based on search and filters
 * @param {Array} events - Array of events
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered events
 */
export const filterAdminEvents = (events, filters) => {
  let filtered = [...events]

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(event => 
      event.title?.toLowerCase().includes(searchTerm) ||
      event.description?.toLowerCase().includes(searchTerm) ||
      event.venue?.toLowerCase().includes(searchTerm) ||
      event.organizers?.toLowerCase().includes(searchTerm)
    )
  }

  // Year filter
  if (filters.year && filters.year !== 'all') {
    filtered = filtered.filter(event => event.year === parseInt(filters.year))
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(event => event.category === filters.category)
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(event => event.status === filters.status)
  }

  // Type filter
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(event => event.type === filters.type)
  }

  // Published filter
  if (filters.published !== undefined && filters.published !== 'all') {
    filtered = filtered.filter(event => event.published === filters.published)
  }

  // Featured filter
  if (filters.featured !== undefined && filters.featured !== 'all') {
    filtered = filtered.filter(event => event.featured === filters.featured)
  }

  return filtered
}

/**
 * Sort events based on criteria
 * @param {Array} events - Array of events
 * @param {string} sortBy - Sort field
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} - Sorted events
 */
export const sortEvents = (events, sortBy = 'date', sortOrder = 'desc') => {
  const sorted = [...events].sort((a, b) => {
    let aVal, bVal

    switch (sortBy) {
      case 'date':
        aVal = new Date(a.date || a.createdAt)
        bVal = new Date(b.date || b.createdAt)
        break
      case 'title':
        aVal = a.title?.toLowerCase() || ''
        bVal = b.title?.toLowerCase() || ''
        break
      case 'year':
        aVal = a.year
        bVal = b.year
        break
      case 'createdAt':
        aVal = new Date(a.createdAt)
        bVal = new Date(b.createdAt)
        break
      case 'participantCount':
        aVal = a.participantCount || 0
        bVal = b.participantCount || 0
        break
      default:
        aVal = a[sortBy]
        bVal = b[sortBy]
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return sorted
}

/**
 * Generate event statistics
 * @param {Array} events - Array of events
 * @returns {Object} - Event statistics
 */
export const generateEventStats = (events) => {
  const stats = {
    total: events.length,
    published: events.filter(e => e.published).length,
    unpublished: events.filter(e => !e.published).length,
    featured: events.filter(e => e.featured).length,
    upcoming: events.filter(e => e.category === 'UPCOMING').length,
    ongoing: events.filter(e => e.category === 'ONGOING').length,
    previous: events.filter(e => e.category === 'PREVIOUS').length,
    byStatus: {
      active: events.filter(e => e.status === 'active').length,
      completed: events.filter(e => e.status === 'completed').length,
      cancelled: events.filter(e => e.status === 'cancelled').length,
      postponed: events.filter(e => e.status === 'postponed').length
    },
    byType: {
      team: events.filter(e => e.type === 'TEAM').length,
      individual: events.filter(e => e.type === 'INDIVIDUAL').length,
      workshop: events.filter(e => e.type === 'WORKSHOP').length,
      seminar: events.filter(e => e.type === 'SEMINAR').length,
      competition: events.filter(e => e.type === 'COMPETITION').length,
      bootcamp: events.filter(e => e.type === 'BOOTCAMP').length
    },
    totalParticipants: events.reduce((sum, e) => sum + (e.participantCount || 0), 0),
    totalRevenue: events.reduce((sum, e) => sum + ((e.participantCount || 0) * (e.entryFee || 0)), 0)
  }

  return stats
}

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Export events to CSV format
 * @param {Array} events - Array of events to export
 * @returns {string} - CSV string
 */
export const exportEventsToCSV = (events) => {
  const headers = [
    'Title',
    'Description',
    'Date',
    'Year',
    'Time',
    'Venue',
    'Category',
    'Type',
    'Status',
    'Organizers',
    'Entry Fee',
    'Participants',
    'Published',
    'Featured',
    'Registrations Available'
  ]

  const rows = events.map(event => [
    event.title || '',
    event.description || '',
    formatEventDate(event.date),
    event.year || '',
    formatEventTime(event.time),
    event.venue || '',
    event.category || '',
    event.type || '',
    event.status || '',
    event.organizers || '',
    event.entryFee || 0,
    event.participantCount || 0,
    event.published ? 'Yes' : 'No',
    event.featured ? 'Yes' : 'No',
    event.registrationsAvailable ? 'Yes' : 'No'
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  return csvContent
}

/**
 * Import events from JSON
 * @param {string} jsonString - JSON string of events
 * @returns {Object} - Import result with events and errors
 */
export const importEventsFromJSON = (jsonString) => {
  try {
    const events = JSON.parse(jsonString)
    
    if (!Array.isArray(events)) {
      return {
        success: false,
        error: 'Invalid format: Expected an array of events'
      }
    }

    const validatedEvents = []
    const errors = []

    events.forEach((event, index) => {
      const validation = validateEventForm(event)
      if (validation.isValid) {
        validatedEvents.push(prepareEventData(event))
      } else {
        errors.push({
          index,
          title: event.title || `Event ${index + 1}`,
          errors: validation.errors
        })
      }
    })

    return {
      success: errors.length === 0,
      events: validatedEvents,
      errors,
      totalEvents: events.length,
      validEvents: validatedEvents.length,
      invalidEvents: errors.length
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse JSON: ' + error.message
    }
  }
}
