import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockEvents } from '../data/eventsData'
import { filterEvents } from '../utils/eventUtils'

/**
 * Custom hook for managing events data and filtering
 */
export const useEvents = (initialYear = '2024') => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Load events based on selected year
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // For now, using mock data
        // In production, replace with Firestore query
        const yearEvents = mockEvents[selectedYear] || []
        setEvents(yearEvents)
        setFilteredEvents(yearEvents)
        
        // Uncomment for Firestore integration
        /*
        const eventsRef = collection(db, 'events')
        const q = query(
          eventsRef,
          where('year', '==', selectedYear),
          orderBy('date', 'desc')
        )
        const snapshot = await getDocs(q)
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setEvents(eventsData)
        setFilteredEvents(eventsData)
        */
      } catch (err) {
        console.error('Error loading events:', err)
        setError('Failed to load events')
        setEvents([])
        setFilteredEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [selectedYear])

  // Filter events when search term or type changes
  useEffect(() => {
    const filtered = filterEvents(events, searchTerm, selectedType)
    setFilteredEvents(filtered)
  }, [searchTerm, selectedType, events])

  return {
    events,
    filteredEvents,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm
  }
}
