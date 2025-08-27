/**
 * Security Headers Component
 * Adds security measures to protect against common attacks
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SecurityHeaders = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    // Prevent clickjacking
    if (window.self !== window.top) {
      window.top.location = window.self.location
    }

    // Disable right-click on payment pages (optional)
    const handleContextMenu = (e) => {
      if (location.pathname === '/recruit' || location.pathname === '/profile') {
        e.preventDefault()
        return false
      }
    }

    // Prevent text selection on sensitive pages (optional)
    const handleSelectStart = (e) => {
      if (location.pathname === '/recruit' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        return false
      }
    }

    // Prevent print screen on payment pages (limited effectiveness)
    const handleKeyDown = (e) => {
      if (location.pathname === '/recruit') {
        // Prevent PrintScreen (limited browser support)
        if (e.keyCode === 44) {
          e.preventDefault()
        }
        // Prevent F12 (DevTools)
        if (e.keyCode === 123) {
          e.preventDefault()
        }
        // Prevent Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
          e.preventDefault()
        }
        // Prevent Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
          e.preventDefault()
        }
        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault()
        }
      }
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [location])

  // Add security-related meta tags
  useEffect(() => {
    // Add CSP meta tag
    const cspMeta = document.createElement('meta')
    cspMeta.httpEquiv = 'Content-Security-Policy'
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://checkout.razorpay.com https://*.firebaseapp.com; style-src 'self' 'unsafe-inline' https://accounts.google.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.emailjs.com https://api.razorpay.com https://checkout.razorpay.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://*.googleapis.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com https://*.firebaseapp.com https://*.firebaseauth.com; font-src 'self' data:;"
    document.head.appendChild(cspMeta)

    // Add X-Frame-Options
    const xframeMeta = document.createElement('meta')
    xframeMeta.httpEquiv = 'X-Frame-Options'
    xframeMeta.content = 'DENY'
    document.head.appendChild(xframeMeta)

    // Add X-Content-Type-Options
    const xcontentMeta = document.createElement('meta')
    xcontentMeta.httpEquiv = 'X-Content-Type-Options'
    xcontentMeta.content = 'nosniff'
    document.head.appendChild(xcontentMeta)

    // Cleanup
    return () => {
      if (cspMeta.parentNode) cspMeta.parentNode.removeChild(cspMeta)
      if (xframeMeta.parentNode) xframeMeta.parentNode.removeChild(xframeMeta)
      if (xcontentMeta.parentNode) xcontentMeta.parentNode.removeChild(xcontentMeta)
    }
  }, [])

  return children
}

export default SecurityHeaders
