import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, RefreshCw, Download, Upload, Trash2, X } from 'lucide-react'
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

  // Delete confirmation modal state
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTitle, setDeleteTitle] = useState('')

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
      // console.error('Error loading events:', error)
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
        await updateEvent(selectedEvent.id, eventData, imageFile)
        toast.success('Event updated successfully!')
      } else {
        await createEvent(eventData, imageFile)
        toast.success('Event created successfully!')
      }
      setShowEventForm(false)
      setSelectedEvent(null)
      loadEvents()
    } catch (error) {
      // console.error('Error saving event:', error?.message || error)
      toast.error(selectedEvent ? 'Failed to update event' : 'Failed to create event')
    } finally {
      setFormLoading(false)
    }
  }

  // Open delete confirmation
  const requestDeleteEvent = (eventId) => {
    const evt = events.find(e => e.id === eventId)
    setDeleteId(eventId)
    setDeleteTitle(evt?.title || 'this event')
  }

  // Confirm delete
  const confirmDeleteEvent = async () => {
    if (!deleteId) return
    try {
      await deleteEvent(deleteId)
      toast.success('Event deleted successfully!')
      setDeleteId(null)
      setDeleteTitle('')
      loadEvents()
    } catch (error) {
      // console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  // Cancel delete
  const cancelDelete = () => {
    setDeleteId(null)
    setDeleteTitle('')
  }

  const handleTogglePublished = async (eventId, published) => {
    try {
      await toggleEventPublished(eventId, published)
      toast.success(`Event ${published ? 'published' : 'unpublished'} successfully!`)
      loadEvents()
    } catch (error) {
      // console.error('Error toggling event published status:', error)
      toast.error('Failed to update event status')
    }
  }

  const handleToggleFeatured = async (eventId, featured) => {
    try {
      await updateEvent(eventId, { featured })
      toast.success(`Event ${featured ? 'featured' : 'unfeatured'} successfully!`)
      loadEvents()
    } catch (error) {
      // console.error('Error toggling event featured status:', error)
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
          toast.success(`Ready to import ${importedEvents.length} events`)
          // Implement batch import here if needed
        } catch (error) {
          toast.error('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="">
      {/* Header - Django style */}
      <div className="django-module">
        <div className="django-module-header flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2" size={18} />
            Event management
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadEvents} className="django-btn django-btn-default flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button onClick={handleExportEvents} className="django-btn django-btn-default flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <label className="django-btn django-btn-default flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportEvents} className="hidden" />
            </label>
            <button onClick={handleCreateEvent} className="django-btn django-btn-primary flex items-center gap-2">
              <Plus size={16} />
              Create event
            </button>
          </div>
        </div>
        <div className="django-module-content">
          <p className="text-sm text-[#666]">Manage all CSI events, workshops, and competitions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#ddd] rounded p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#666]">Total events</p>
                <p className="text-3xl font-bold text-[#333] mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#ddd] rounded p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#666]">Published</p>
                <p className="text-3xl font-bold text-[#333] mt-2">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#ddd] rounded p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#666]">Upcoming</p>
                <p className="text-3xl font-bold text-[#333] mt-2">{stats.upcoming}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-[#ddd] rounded p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#666]">Previous</p>
                <p className="text-3xl font-bold text-[#333] mt-2">{stats.previous}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="text-gray-600" size={24} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Events List */}
      <div className="pb-6">
        <EventList
          events={events}
          onEdit={handleEditEvent}
          onDelete={requestDeleteEvent}
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
              <button onClick={cancelDelete} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete "<span className="font-medium">{deleteTitle}</span>"? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}