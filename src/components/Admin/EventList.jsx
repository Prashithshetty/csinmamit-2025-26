import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
  ExternalLink,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react'

const EventList = ({ events, onEdit, onDelete, onTogglePublished, onToggleFeatured, loading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [expandedRows, setExpandedRows] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Get unique years from events
  const years = [...new Set(events.map(e => e.year))].sort((a, b) => b - a)
  
  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = filterYear === 'all' || event.year === parseInt(filterYear)
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    
    return matchesSearch && matchesYear && matchesCategory && matchesStatus
  })

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
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

  const toggleRowExpansion = (eventId) => {
    setExpandedRows(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const handleDelete = (eventId) => {
    if (deleteConfirm === eventId) {
      onDelete(eventId)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(eventId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'UPCOMING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'PREVIOUS':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'ONGOING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PREVIOUS">Previous</option>
            <option value="ONGOING">Ongoing</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="postponed">Postponed</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {sortedEvents.length} of {events.length} events
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="createdAt">Created</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {sortOrder === 'asc' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-[#ddd] rounded overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">No events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full django-table">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#666]">
                    Event
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#666]">
                    Date & Year
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#666]">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#666]">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#666]">
                    Visibility
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-[#666]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-[#f5f5f5] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {event.image ? (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={event.image}
                                  alt={event.title}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                  <ImageIcon size={20} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#333]">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.venue}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-[#333]">
                            {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Year: {event.year}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onTogglePublished(event.id, !event.published)}
                              className={`p-1 rounded ${event.published ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                              title={event.published ? 'Published' : 'Unpublished'}
                            >
                              {event.published ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              onClick={() => onToggleFeatured(event.id, !event.featured)}
                              className={`p-1 rounded ${event.featured ? 'text-yellow-600 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                              title={event.featured ? 'Featured' : 'Not Featured'}
                            >
                              {event.featured ? <Star size={18} /> : <StarOff size={18} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(event.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              {expandedRows.includes(event.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            <button
                              onClick={() => onEdit(event)}
                              className="text-[#417690] hover:text-[#205067]"
                              title="Edit Event"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className={`${deleteConfirm === event.id ? 'text-red-600' : 'text-gray-600'} hover:text-red-900`}
                              title={deleteConfirm === event.id ? 'Click again to confirm' : 'Delete Event'}
                            >
                              <Trash2 size={18} />
                            </button>
                            {event.cloudinaryUrl && (
                              <a
                                href={event.cloudinaryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                                title="View Image"
                              >
                                <ExternalLink size={18} />
                              </a>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                      
                      {/* Expanded Details Row */}
                      <AnimatePresence>
                        {expandedRows.includes(event.id) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <td colSpan="6" className="px-4 py-3 bg-[#f5f5f5]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-[#333] mb-2">Description</h4>
                                  <p className="text-sm text-gray-600">
                                    {event.description || 'No description available'}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-[#333] mb-2">Event Details</h4>
                                  <dl className="text-sm space-y-1">
                                    <div className="flex">
                                      <dt className="font-medium text-gray-600 w-32">Type:</dt>
                                      <dd className="text-[#333]">{event.type}</dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="font-medium text-gray-600 w-32">Time:</dt>
                                      <dd className="text-[#333]">{event.time || 'N/A'}</dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="font-medium text-gray-600 w-32">Entry Fee:</dt>
                                      <dd className="text-[#333]">₹{event.entryFee || 0}</dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="font-medium text-gray-600 w-32">Organizers:</dt>
                                      <dd className="text-[#333]">{event.organizers || 'CSI NMAMIT'}</dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="font-medium text-gray-600 w-32">Registrations:</dt>
                                      <dd className="text-[#333]">
                                        {event.registrationsAvailable ? 'Open' : 'Closed'}
                                      </dd>
                                    </div>
                                    <div className="flex">
                                      <dt className="font-medium text-gray-600 w-32">Participants:</dt>
                                      <dd className="text-[#333]">{event.participantCount || 0}</dd>
                                    </div>
                                  </dl>
                                </div>
                                {event.contactPersons && event.contactPersons.length > 0 && (
                                  <div className="md:col-span-2">
                                    <h4 className="font-semibold text-[#333] mb-2">Contact Persons</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {event.contactPersons.map((person, index) => (
                                        <div key={index} className="text-sm text-gray-600">
                                          {person.name} - {person.phone} - {person.email}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventList
