import { useState, useRef } from 'react'
import { Camera, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfileAvatar = ({ 
  user, 
  getUserRoleDisplay, 
  getRoleCategory, 
  onImageSelect,
  isUploading,
  previewUrl 
}) => {
  const fileInputRef = useRef(null)
  
  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB')
      return
    }
    
    // Pass the file to parent component
    onImageSelect(file)
  }
  
  // Determine which image to show
  const displayImage = previewUrl || user?.photoURL || '/default-avatar.png'
  
  return (
    <div className="flex items-center space-x-4 mb-4 md:mb-0">
      <div className="relative">
        <img
          src={displayImage}
          alt={user?.name}
          className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover"
        />
        <button 
          type="button"
          onClick={handleImageClick}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isUploading ? 'Uploading...' : 'Change profile picture'}
        >
          {isUploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Camera size={16} />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="mt-16 md:mt-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user?.name}
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Sparkles size={14} className="mr-1" />
            {getUserRoleDisplay()}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getRoleCategory()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileAvatar
