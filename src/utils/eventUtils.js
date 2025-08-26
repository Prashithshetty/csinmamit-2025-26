import { EVENT_TYPE_COLORS } from '../constants/eventConstants'

/**
 * Get the color gradient for an event type
 * @param {string} type - The event type
 * @returns {string} - The Tailwind gradient classes
 */
export const getEventTypeColor = (type) => {
  return EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default
}

/**
 * Format event date to readable string
 * @param {string} date - The date string
 * @returns {string} - Formatted date
 */
export const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Filter events based on search term and type
 * @param {Array} events - Array of events
 * @param {string} searchTerm - Search term
 * @param {string} selectedType - Selected event type
 * @returns {Array} - Filtered events
 */
export const filterEvents = (events, searchTerm, selectedType) => {
  let filtered = [...events]

  if (searchTerm) {
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (selectedType !== 'all') {
    filtered = filtered.filter(event => event.type === selectedType)
  }

  return filtered
}

/**
 * Sort events by date
 * @param {Array} events - Array of events
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted events
 */
export const sortEventsByDate = (events, order = 'asc') => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return order === 'asc' ? dateA - dateB : dateB - dateA
  })
}
