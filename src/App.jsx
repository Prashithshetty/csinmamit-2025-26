/**
 * Secure App Component with Security Headers and Protection
 */

import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import SecurityHeaders from './middleware/SecurityHeaders'

// Layout
import Layout from './components/Layout/Layout'

// Pages
import Home from './pages/Home'
import Events from './pages/Events-new'
import Team from './pages/Team-new'
import Profile from './pages/Profile-new'
import Recruit from './pages/Recruit-new'
import NotFound from './pages/NotFound'

// Security monitoring
import { useEffect } from 'react'

function App() {
  
  useEffect(() => {
    // Disable console in production
    if (import.meta.env.VITE_APP_ENV === 'production') {
      console.log = () => {}
      console.warn = () => {}
      console.error = () => {}
      console.info = () => {}
      console.debug = () => {}
    }

    // Detect DevTools (basic protection)
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        if (import.meta.env.VITE_APP_ENV === 'production') {
          document.body.innerHTML = 'DevTools detected. This action has been logged.'
        }
      }
    }

    // Check periodically
    const interval = setInterval(detectDevTools, 1000)

    // Prevent right-click in production
    const handleContextMenu = (e) => {
      if (import.meta.env.VITE_APP_ENV === 'production') {
        e.preventDefault()
        return false
      }
    }

    // Prevent text selection on payment pages
    const handleSelectStart = (e) => {
      const restrictedPaths = ['/recruit', '/profile']
      if (restrictedPaths.includes(window.location.pathname)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          return false
        }
      }
    }

    // Prevent keyboard shortcuts
    const handleKeyDown = (e) => {
      if (import.meta.env.VITE_APP_ENV === 'production') {
        // Prevent F12
        if (e.keyCode === 123) {
          e.preventDefault()
          return false
        }
        // Prevent Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
          e.preventDefault()
          return false
        }
        // Prevent Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
          e.preventDefault()
          return false
        }
        // Prevent Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault()
          return false
        }
        // Prevent Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault()
          return false
        }
      }
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      clearInterval(interval)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <SecurityHeaders>
          <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
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
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="team" element={<Team />} />
                <Route path="profile" element={<Profile />} />
                <Route path="recruit" element={<Recruit />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </div>
        </SecurityHeaders>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
