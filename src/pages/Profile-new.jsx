import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfileFirestore } from '../hooks/useProfileFirestore'
import ProfileHero from '../components/Profile/ProfileHero'
import ProfileCard from '../components/Profile/ProfileCard'
import ProfileForm from '../components/Profile/ProfileForm'
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

  return (
    <>
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {authLoading || profileLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <ProfileHero user={user} />

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
                <MembershipDetails user={user} />
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default Profile
