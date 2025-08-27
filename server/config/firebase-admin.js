/**
 * Firebase Admin SDK Configuration
 * Initializes Firebase Admin for server-side operations
 */

import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Firebase Admin
let adminApp

try {
  // Check if service account key is provided via environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Parse the service account key from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    })
    
    console.log('✅ Firebase Admin initialized with service account')
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use the path to service account key file
    adminApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    })
    
    console.log('✅ Firebase Admin initialized with application default credentials')
  } else {
    // Try to initialize with default credentials (for Google Cloud environments)
    adminApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    })
    
    console.log('✅ Firebase Admin initialized with default credentials')
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message)
  console.log('📝 Please ensure you have set up Firebase Admin credentials properly')
  console.log('   Option 1: Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable with the JSON key')
  console.log('   Option 2: Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account key file')
  
  // Don't throw error in development to allow the server to start
  if (process.env.NODE_ENV === 'production') {
    throw error
  }
}

// Get Firestore instance
const adminDb = adminApp ? admin.firestore() : null

// Get Auth instance
const adminAuth = adminApp ? admin.auth() : null

export { adminApp, adminDb, adminAuth, admin }
export default adminApp
