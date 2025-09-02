import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Check if Firebase config is available
const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                         import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here'

let auth, googleProvider, db, storage, isDemoMode, app

if (hasFirebaseConfig) {
  // Use real Firebase configuration
  // console.log('🔥 Using Firebase configuration')
  
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
  app = initializeApp(firebaseConfig)

  // Initialize Firebase services
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  db = getFirestore(app)
  storage = getStorage(app)
  isDemoMode = false

  // Configure Google Auth Provider
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  })
  
  // console.log('✅ Firebase initialized successfully')
} else {
  // Firebase configuration not found - create mock objects to prevent errors
  console.warn('⚠️ Firebase configuration not found. Running in offline mode.')
  console.info('📖 Some features may not work without Firebase configuration.')
  
  // Create mock objects that won't cause errors
  auth = null
  googleProvider = null
  db = null
  storage = null
  isDemoMode = true
  app = null
}

// Export all services
export { auth, googleProvider, db, storage, isDemoMode }
export default app
