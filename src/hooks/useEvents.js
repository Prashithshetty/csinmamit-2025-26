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
        // Fetch from Firestore
        const eventsRef = collection(db, 'events')
        const q = query(
          eventsRef,
          where('year', '==', parseInt(selectedYear)),
          where('published', '==', true),
          orderBy('date', 'desc')
        )
        
        try {
          const snapshot = await getDocs(q)
          const eventsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setEvents(eventsData)
          setFilteredEvents(eventsData)
        } catch (firestoreError) {
          // If Firestore query fails (e.g., index not created), try without orderBy
          // console.warn('Firestore query with orderBy failed, trying without ordering:', firestoreError)
          
          const simpleQuery = query(
            eventsRef,
            where('year', '==', parseInt(selectedYear)),
            where('published', '==', true)
          )
          
          const snapshot = await getDocs(simpleQuery)
          const eventsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // Sort manually if orderBy failed
          eventsData.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt)
            const dateB = new Date(b.date || b.createdAt)
            return dateB - dateA
          })
          
          setEvents(eventsData)
          setFilteredEvents(eventsData)
        }
        
        // If no events in Firestore, fallback to mock data
        if (events.length === 0 && mockEvents[selectedYear]) {
          // console.log('No events in Firestore, using mock data')
          const yearEvents = mockEvents[selectedYear] || []
          setEvents(yearEvents)
          setFilteredEvents(yearEvents)
        }
      } catch (err) {
        // console.error('Error loading events:', err)
        setError('Failed to load events')
        
        // Fallback to mock data on error
        const yearEvents = mockEvents[selectedYear] || []
        setEvents(yearEvents)
        setFilteredEvents(yearEvents)
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
