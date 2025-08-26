import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'

// Components
import ProfileHero from '../components/Profile/ProfileHero'
import ProfileCard from '../components/Profile/ProfileCard'
import QuickActions from '../components/Profile/QuickActions'
import ProfileForm from '../components/Profile/ProfileForm'
import MembershipDetails from '../components/Profile/MembershipDetails'

// Hooks
import { useProfile } from '../hooks/useProfile'

const Profile = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  
  const {
    profileData,
    isEditing,
    loading,
    handleEdit,
    handleCancel,
    handleSave,
    handleInputChange
  } = useProfile()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
      toast.error('Please sign in to view your profile')
    }
  }, [user, authLoading, navigate])

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  // Return null if no user (will redirect)
  if (!user) {
    return null
  }

  // Extract membership details
  const membershipStatus = user.membership?.status || 'inactive'
  const membershipType = user.membership?.type || 'Free'
  const membershipExpiry = user.membership?.expiresAt

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Section */}
      <ProfileHero />

      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div>
            <ProfileCard 
              user={user}
              membershipStatus={membershipStatus}
              membershipType={membershipType}
            />
            <QuickActions />
          </div>

          {/* Right Content */}
          <div>
            <ProfileForm
              profileData={profileData}
              isEditing={isEditing}
              loading={loading}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onInputChange={handleInputChange}
            />
            <MembershipDetails
              membershipStatus={membershipStatus}
              membershipType={membershipType}
              membershipExpiry={membershipExpiry}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
