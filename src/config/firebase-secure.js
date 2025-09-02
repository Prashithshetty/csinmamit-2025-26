/**
 * Secure Firebase Configuration
 * All sensitive keys are loaded from environment variables
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Validate environment variables
const validateEnvVariables = () => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ]

  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    // console.error('Missing required environment variables:', missing)
    throw new Error('Firebase configuration is incomplete. Please check your .env file.')
  }
}

// Validate configuration before initializing
validateEnvVariables()

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
let app
let auth
let db
let analytics

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  
  // Only initialize analytics in production
  if (import.meta.env.VITE_APP_ENV === 'production' && 
      import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    analytics = getAnalytics(app)
  }
} catch (error) {
  // console.error('Firebase initialization error:', error)
  throw error
}

// Security rules helper functions
export const securityRules = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return auth.currentUser !== null
  },
  
  // Check if user is admin (you'll need to implement admin checking logic)
  isAdmin: async (uid) => {
    try {
      const adminDoc = await db.collection('admins').doc(uid).get()
      return adminDoc.exists
    } catch (error) {
      // console.error('Admin check error:', error)
      return false
    }
  },
  
  // Check if user owns the document
  isOwner: (docUserId, currentUserId) => {
    return docUserId === currentUserId
  }
}

export { app, auth, db, analytics }
