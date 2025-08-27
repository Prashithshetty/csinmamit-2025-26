import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProfileFirestore } from '../hooks/useProfileFirestore'
import ProfileHero from '../components/Profile/ProfileHero'
import ProfileCard from '../components/Profile/ProfileCard'
import ProfileForm from '../components/Profile/ProfileForm'
import ProfileStats from '../components/Profile/ProfileStats'
import MembershipDetails from '../components/Profile/MembershipDetails'
import QuickActions from '../components/Profile/QuickActions'
import { Toaster } from 'react-hot-toast'

const Profile = () => {
  const { user, loading: authLoading } = useAuth()
  const {
    profileData,
    isEditing,
    loading: profileLoading,
    handleEdit,
    handleCancel,
    handleSave,
    handleInputChange
  } = useProfileFirestore()

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <ProfileHero user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard user={user} profileData={profileData} />
            <QuickActions />
          </div>
          
          {/* Right Column - Profile Form & Other Components */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileForm
              profileData={profileData}
              isEditing={isEditing}
              loading={profileLoading}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              onInputChange={handleInputChange}
            />
            
            {/* <ProfileStats user={user} /> */}
            <MembershipDetails user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
