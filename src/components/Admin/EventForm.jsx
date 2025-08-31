import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Upload, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Tag,
  FileText,
  User,
  Save,
  Loader,
  CheckCircle,
  CloudUpload
} from 'lucide-react'
import { uploadToCloudinary } from '../../services/eventService'
import { isCloudinaryConfigured, getCloudinaryStatus } from '../../config/cloudinary'
import { toast } from 'react-hot-toast'

const EventForm = ({ event, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brief: '',
    category: 'UPCOMING',
    type: 'TEAM',
    date: '',
    year: new Date().getFullYear(),
    time: '',
    venue: '',
    organizers: 'CSI NMAMIT',
    entryFee: 0,
    registrationsAvailable: false,
    published: false,
    featured: false,
    status: 'active',
    contactPersons: []
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [errors, setErrors] = useState({})
  const [contactPerson, setContactPerson] = useState({ name: '', phone: '', email: '' })

  // Event categories
  const categories = ['UPCOMING', 'PREVIOUS', 'ONGOING']
  const types = ['TEAM', 'INDIVIDUAL', 'WORKSHOP', 'SEMINAR', 'COMPETITION', 'BOOTCAMP']
  const statuses = ['active', 'completed', 'cancelled', 'postponed']

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        year: event.year || new Date().getFullYear(),
        contactPersons: event.contactPersons || []
      })
      if (event.image) {
        setImagePreview(event.image)
        setCloudinaryUrl(event.image)
        setImageUploaded(true) // For editing, image is already uploaded
      }
    }
  }, [event])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }))
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, image: '' }))
      // Reset upload status when new image is selected
      setImageUploaded(false)
      setCloudinaryUrl(null)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Please select an image first')
      return
    }

    // Check Cloudinary configuration before attempting upload
    if (!isCloudinaryConfigured()) {
      const status = getCloudinaryStatus();
      // console.error('Cloudinary configuration:', status);
      toast.error(`Cloudinary is not properly configured. Cloud name: ${status.cloudName}`);
      setErrors(prev => ({ 
        ...prev, 
        image: 'Cloudinary configuration error. Please contact administrator.' 
      }))
      return;
    }

    setImageUploading(true)
    try {
      const folder = `csi-events/${formData.year || new Date().getFullYear()}`
      const url = await uploadToCloudinary(imageFile, folder)
      setCloudinaryUrl(url)
      setImageUploaded(true)
      toast.success('Image uploaded successfully! You can now fill in the event details.')
      setErrors(prev => ({ ...prev, image: '' }))
    } catch (error) {
      // console.error('Error uploading image:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload image. ';
      if (error.message.includes('preset')) {
        errorMessage += 'Upload preset not configured in Cloudinary. Please create "csi-events" preset or contact administrator.';
      } else if (error.message.includes('cloud name')) {
        errorMessage += 'Invalid Cloudinary cloud name configuration.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      toast.error(errorMessage)
      setErrors(prev => ({ ...prev, image: errorMessage }))
    } finally {
      setImageUploading(false)
    }
  }

  const addContactPerson = () => {
    if (contactPerson.name && (contactPerson.phone || contactPerson.email)) {
      setFormData(prev => ({
        ...prev,
        contactPersons: [...prev.contactPersons, contactPerson]
      }))
      setContactPerson({ name: '', phone: '', email: '' })
    }
  }

  const removeContactPerson = (index) => {
    setFormData(prev => ({
      ...prev,
      contactPersons: prev.contactPersons.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.venue) newErrors.venue = 'Venue is required'
    if (!cloudinaryUrl) newErrors.image = 'Event poster must be uploaded first'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Pass the cloudinary URL along with form data
      // Ensure entryFee is a number, not a string
      const submitData = {
        ...formData,
        cloudinaryUrl: cloudinaryUrl,
        entryFee: Number(formData.entryFee) || 0,
        year: Number(formData.year) || new Date().getFullYear()
      }
      // console.log(submitData)
      onSubmit(submitData, null) // No need to pass imageFile since it's already uploaded
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#ddd]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#ddd] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#333]">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="bg-[#f8f8f8] p-4 rounded-lg border border-[#eee]">
            <label className="block text-sm font-medium text-[#333] mb-2">
              Step 1: Upload Event Poster * (Required before filling form)
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
                  imageUploaded 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}>
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      {imageUploaded && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                          <CheckCircle size={24} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to select image</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageUploading}
                  />
                </label>
                
                {/* Upload Button */}
                {imageFile && !imageUploaded && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={imageUploading}
                    className="mt-3 w-full django-btn django-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {imageUploading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <CloudUpload size={20} />
                        <span>Upload Image to Cloudinary</span>
                      </>
                    )}
                  </button>
                )}
                
                {/* Success Message */}
                {imageUploaded && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-500 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <CheckCircle className="mr-2" size={16} />
                      Image uploaded successfully! You can now fill in the event details.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>

          {/* Form Fields Section - Disabled until image is uploaded */}
          <div className={`space-y-6 ${!imageUploaded ? 'opacity-50 pointer-events-none' : ''}`}>
            {!imageUploaded && (
              <div className="p-4 bg-yellow-100 border border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Please upload the event poster first to enable the form fields.
                </p>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="django-form-label mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="django-form-input"
                placeholder="Enter event title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="django-form-label mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="django-form-input"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            </div>

            {/* Description */}
            <div>
            <label className="django-form-label mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="django-form-input"
              placeholder="Enter detailed event description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Brief */}
            <div>
            <label className="django-form-label mb-2">
              Brief Summary
            </label>
            <input
              type="text"
              name="brief"
              value={formData.brief}
              onChange={handleInputChange}
              className="django-form-input"
              placeholder="Short summary of the event"
            />
            </div>

            {/* Date, Time, Year */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="django-form-label mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="django-form-input"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="django-form-label mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="django-form-input"
              />
            </div>

            <div>
              <label className="django-form-label mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="2019"
                max="2030"
                className="django-form-input"
              />
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>
            </div>

            {/* Venue, Type, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="django-form-label mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="django-form-input"
                placeholder="Event venue"
              />
              {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
            </div>

            <div>
              <label className="django-form-label mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="django-form-input"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="django-form-label mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="django-form-input"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            </div>

            {/* Organizers and Entry Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="django-form-label mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Organizers
              </label>
              <input
                type="text"
                name="organizers"
                value={formData.organizers}
                onChange={handleInputChange}
                className="django-form-input"
                placeholder="Event organizers"
              />
            </div>

            <div>
              <label className="django-form-label mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Entry Fee (₹)
              </label>
              <input
                type="number"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleInputChange}
                min="0"
                className="django-form-input"
              />
            </div>
            </div>

            {/* Contact Persons */}
            <div>
            <label className="django-form-label mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Contact Persons
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={contactPerson.name}
                  onChange={(e) => setContactPerson(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 django-form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={contactPerson.phone}
                  onChange={(e) => setContactPerson(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 django-form-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactPerson.email}
                  onChange={(e) => setContactPerson(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 django-form-input"
                />
                <button
                  type="button"
                  onClick={addContactPerson}
                  className="django-btn django-btn-primary"
                >
                  Add
                </button>
              </div>
              {formData.contactPersons.map((person, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm">
                    {person.name} - {person.phone} - {person.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeContactPerson(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="registrationsAvailable"
                checked={formData.registrationsAvailable}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-2"
              />
              <span className="text-sm text-[#333]">Registrations Available</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-2"
              />
              <span className="text-sm text-[#333]">Published</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-2"
              />
              <span className="text-sm text-[#333]">Featured Event</span>
            </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#ddd]">
            <button
              type="button"
              onClick={onCancel}
              className="django-btn django-btn-default"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="django-btn django-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{event ? 'Update Event' : 'Create Event'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default EventForm
