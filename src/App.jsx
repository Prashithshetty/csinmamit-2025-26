/**
 * Secure App Component with Security Headers and Protection
 */

import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import SecurityHeaders from './middleware/SecurityHeaders'
import { lazy, Suspense, useEffect, useState } from 'react'
// import ProfileCompletionModal from './components/Profile/ProfileCompletionModal'

// Layout
import Layout from './components/Layout/Layout'
import UserGuard from './components/Layout/UserGuard'

// Guards
import CoreMemberGuard from './components/Guards/CoreMemberGuard'

// Pages
import Home from './pages/Home'
import Events from './pages/Events-new'
import Team from './pages/Team-new'
import Profile from './pages/Profile-new'
import Recruit from './pages/Recruit-new'
import NotFound from './pages/NotFound'
// import CoreDashboard from './pages/CoreDashboard'
import CoreMemberProfile from './pages/CoreMemberProfile'

// UI Demo Pages (only in development)
// import GlitchTextDemo from './components/UI/GlitchTextDemo'

// Admin Components - Lazy loaded for security and performance
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'))
const AdminGuard = lazy(() => import('./components/Admin/AdminGuard'))
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers-clean'))
const AdminEvents = lazy(() => import('./pages/Admin/AdminEvents'))
const AdminEMembers = lazy(() => import('./pages/Admin/AdminEMembers-clean'))

// Loading component for lazy loaded admin routes
const AdminLoading = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

// Wrapper component to handle profile completion modal
function AppContent() {
  const { user, isProfileIncomplete, checkProfileCompletion, isUserCoreMember } = useAuth()
  // const [showProfileModal, setShowProfileModal] = useState(false)

  // Show modal when user is logged in and profile is incomplete
  // useEffect(() => {
  //   if (user && isProfileIncomplete) {
  //     setShowProfileModal(true)
  //   } else {
  //     setShowProfileModal(false)
  //   }
  // }, [user, isProfileIncomplete])

  // Handle profile completion
  // const handleProfileComplete = async () => {
  //   await checkProfileCompletion()
  //   setShowProfileModal(false)
  // }

  return (
    <>
      {/* Profile Completion Modal */}
      {/* <ProfileCompletionModal 
        isOpen={showProfileModal}
        onComplete={handleProfileComplete}
      /> */}

      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '0.5rem',
              border: '1px solid rgba(59, 130, 246, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="team" element={<Team />} />
            <Route path="recruit" element={<Recruit />} />
            
            {/* Demo Routes (only in development) */}
            {/* {import.meta.env.DEV && (
              <Route path="demo/glitch-text" element={<GlitchTextDemo />} />
            )} */}
            
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected User Routes */}
          <Route path="/profile" element={
            <UserGuard>
              <Layout />
            </UserGuard>
          }>
            <Route index element={<Profile />} />
          </Route>

          {/* Protected Core Member Routes */}
          {/* <Route path="/dashboard" element={
            <CoreMemberGuard>
              <Layout />
            </CoreMemberGuard>
          }>
            <Route index element={<CoreDashboard />} />
          </Route> */}

          {/* Core Member Profile Route */}
          <Route path="/core-profile" element={
            <CoreMemberGuard>
              <Layout />
            </CoreMemberGuard>
          }>
            <Route index element={<CoreMemberProfile />} />
          </Route>

          {/* Admin Login - Public admin route */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Protected Admin Routes with Layout */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              </Suspense>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="members" element={<AdminEMembers/>} />
            <Route path="payments" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Payments Management</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
            <Route path="content" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Content Management</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
            <Route path="analytics" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Analytics</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
            <Route path="messages" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Messages</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-3xl font-bold text-white">Settings</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

function App() {
  useEffect(() => {
    // Only apply minimal security in production
    // Removed aggressive DevTools detection and console blocking for better UX
    
    // Only prevent text selection on sensitive payment pages
    const handleSelectStart = (e) => {
      const restrictedPaths = ['/recruit', '/profile']
      if (restrictedPaths.includes(window.location.pathname)) {
        // Only prevent selection on payment-related elements
        if (e.target.closest('.payment-info, .card-details, .sensitive-data')) {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault()
            return false
          }
        }
      }
    }

    // Optional: Add a subtle watermark instead of blocking right-click
    const addWatermark = () => {
      if (import.meta.env.VITE_APP_ENV === 'production') {
        // You can add a watermark to copied content instead of blocking
        document.addEventListener('copy', (e) => {
          const selection = window.getSelection().toString()
          if (selection.length > 50) {
            e.clipboardData.setData('text/plain', selection + '\n\n© CSI NMAMIT')
            e.preventDefault()
          }
        })
      }
    }

    // Add event listeners
    document.addEventListener('selectstart', handleSelectStart)
    addWatermark()

    // Cleanup
    return () => {
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <SecurityHeaders>
            <AppContent />
          </SecurityHeaders>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
