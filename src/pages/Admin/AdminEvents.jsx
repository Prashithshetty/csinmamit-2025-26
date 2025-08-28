import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, RefreshCw, Download, Upload } from 'lucide-react'
import EventForm from '../../components/Admin/EventForm'
import EventList from '../../components/Admin/EventList'
import { 
  getAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  toggleEventPublished 
} from '../../services/eventService'
import { toast } from 'react-hot-toast'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    upcoming: 0,
    previous: 0
  })

  // Load events on component mount
  useEffect(() => {
    loadEvents()
  }, [])

  // Calculate stats when events change
  useEffect(() => {
    const total = events.length
    const published = events.filter(e => e.published).length
    const upcoming = events.filter(e => e.category === 'UPCOMING').length
    const previous = events.filter(e => e.category === 'PREVIOUS').length
    
    setStats({ total, published, upcoming, previous })
  }, [events])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const eventsData = await getAllEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setShowEventForm(true)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setShowEventForm(true)
  }

  const handleSubmitEvent = async (eventData, imageFile) => {
    setFormLoading(true)
    try {
      if (selectedEvent) {
        // Update existing event
        await updateEvent(selectedEvent.id, eventData, imageFile)
        toast.success('Event updated successfully!')
      } else {
        // Create new event
        await createEvent(eventData, imageFile)
        toast.success('Event created successfully!')
      }
      setShowEventForm(false)
      setSelectedEvent(null)
      loadEvents() // Reload events
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error(selectedEvent ? 'Failed to update event' : 'Failed to create event')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId)
      toast.success('Event deleted successfully!')
      loadEvents() // Reload events
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  const handleTogglePublished = async (eventId, published) => {
    try {
      await toggleEventPublished(eventId, published)
      toast.success(`Event ${published ? 'published' : 'unpublished'} successfully!`)
      loadEvents() // Reload events
    } catch (error) {
      console.error('Error toggling event published status:', error)
      toast.error('Failed to update event status')
    }
  }

  const handleToggleFeatured = async (eventId, featured) => {
    try {
      await updateEvent(eventId, { featured })
      toast.success(`Event ${featured ? 'featured' : 'unfeatured'} successfully!`)
      loadEvents() // Reload events
    } catch (error) {
      console.error('Error toggling event featured status:', error)
      toast.error('Failed to update event status')
    }
  }

  const handleExportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `events_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('Events exported successfully!')
  }

  const handleImportEvents = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const importedEvents = JSON.parse(event.target.result)
          // Here you would typically validate and import the events
          toast.success(`Ready to import ${importedEvents.length} events`)
          // You can implement batch import logic here
        } catch (error) {
          toast.error('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="mr-3" size={32} />
                  Event Management
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage all CSI events, workshops, and competitions
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={loadEvents}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw size={20} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExportEvents}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Export</span>
                </button>
                <label className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 cursor-pointer">
                  <Upload size={20} />
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportEvents}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Create Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="text-green-600 dark:text-green-300" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.upcoming}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="text-purple-600 dark:text-purple-300" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Previous</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.previous}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Calendar className="text-gray-600 dark:text-gray-300" size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <EventList
          events={events}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onTogglePublished={handleTogglePublished}
          onToggleFeatured={handleToggleFeatured}
          loading={loading}
        />
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={selectedEvent}
          onSubmit={handleSubmitEvent}
          onCancel={() => {
            setShowEventForm(false)
            setSelectedEvent(null)
          }}
          loading={formLoading}
        />
      )}
    </div>
  )
}
