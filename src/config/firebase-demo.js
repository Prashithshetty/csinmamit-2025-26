/**
 * Demo Firebase Configuration
 * This file provides mock Firebase services for demonstration purposes
 * DO NOT USE IN PRODUCTION
 */

// Mock user data
const DEMO_USER = {
  uid: 'demo-user-123',
  email: 'demo@csinmamit.com',
  displayName: 'Demo User',
  photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=3b82f6&color=fff'
}

const DEMO_ADMIN = {
  uid: 'demo-admin-456',
  email: 'admin@csinmamit.com',
  displayName: 'Admin User',
  photoURL: 'https://ui-avatars.com/api/?name=Admin+User&background=8b5cf6&color=fff',
  role: 'admin',
  verified: true
}

// Mock Auth
class MockAuth {
  currentUser = null
  authStateCallbacks = []

  onAuthStateChanged(callback) {
    this.authStateCallbacks.push(callback)
    // Immediately call with null (not logged in)
    callback(null)
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateCallbacks.indexOf(callback)
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1)
      }
    }
  }

  signInWithPopup(provider) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate Google sign-in
        const isAdmin = Math.random() > 0.5 // 50% chance to be admin for demo
        const user = isAdmin ? DEMO_ADMIN : DEMO_USER
        this.currentUser = user
        
        // Notify all listeners
        this.authStateCallbacks.forEach(cb => cb(user))
        
        resolve({ user })
      }, 1000)
    })
  }

  signOut() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null
        // Notify all listeners
        this.authStateCallbacks.forEach(cb => cb(null))
        resolve()
      }, 500)
    })
  }
}

// Mock Firestore
class MockFirestore {
  data = {
    users: {
      'demo-user-123': {
        uid: 'demo-user-123',
        email: 'demo@csinmamit.com',
        name: 'Demo User',
        role: 'member',
        joinedAt: new Date(),
        membership: {
          status: 'active',
          type: 'premium',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      }
    },
    admins: {
      'demo-admin-456': {
        uid: 'demo-admin-456',
        email: 'admin@csinmamit.com',
        name: 'Admin User',
        role: 'admin',
        verified: true,
        permissions: {
          users: true,
          events: true,
          members: true,
          content: true,
          settings: true
        }
      }
    },
    adminOTPs: {},
    events: {
      'event-1': {
        id: 'event-1',
        title: 'Tech Talk: AI & Machine Learning',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        registrations: 45
      },
      'event-2': {
        id: 'event-2',
        title: 'Web Development Workshop',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        registrations: 32
      }
    }
  }

  collection(name) {
    return {
      doc: (id) => this.doc(`${name}/${id}`),
      add: (data) => this.addDoc(name, data),
      get: () => this.getDocs(name)
    }
  }

  doc(path) {
    const [collection, id] = path.split('/')
    return {
      get: () => this.getDoc(collection, id),
      set: (data, options) => this.setDoc(collection, id, data, options),
      update: (data) => this.updateDoc(collection, id, data),
      delete: () => this.deleteDoc(collection, id)
    }
  }

  getDoc(collection, id) {
    return Promise.resolve({
      exists: () => !!this.data[collection]?.[id],
      data: () => this.data[collection]?.[id],
      id
    })
  }

  setDoc(collection, id, data, options = {}) {
    if (!this.data[collection]) {
      this.data[collection] = {}
    }
    
    if (options.merge) {
      this.data[collection][id] = {
        ...this.data[collection][id],
        ...data
      }
    } else {
      this.data[collection][id] = data
    }
    
    return Promise.resolve()
  }

  updateDoc(collection, id, data) {
    if (this.data[collection]?.[id]) {
      this.data[collection][id] = {
        ...this.data[collection][id],
        ...data
      }
    }
    return Promise.resolve()
  }

  deleteDoc(collection, id) {
    if (this.data[collection]?.[id]) {
      delete this.data[collection][id]
    }
    return Promise.resolve()
  }

  getDocs(collection) {
    const docs = Object.entries(this.data[collection] || {}).map(([id, data]) => ({
      id,
      data: () => data
    }))
    
    return Promise.resolve({
      docs,
      empty: docs.length === 0,
      size: docs.length
    })
  }

  addDoc(collection, data) {
    if (!this.data[collection]) {
      this.data[collection] = {}
    }
    
    const id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    this.data[collection][id] = { ...data, id }
    
    return Promise.resolve({ id })
  }
}

// Mock Storage
class MockStorage {
  uploadBytes(ref, file) {
    return Promise.resolve({
      ref,
      metadata: {
        name: file.name,
        size: file.size,
        contentType: file.type
      }
    })
  }

  getDownloadURL(ref) {
    return Promise.resolve(`https://via.placeholder.com/150?text=${ref.name || 'Image'}`)
  }

  ref(path) {
    return {
      name: path.split('/').pop(),
      fullPath: path,
      child: (childPath) => this.ref(`${path}/${childPath}`)
    }
  }
}

// Mock providers
class MockGoogleAuthProvider {
  setCustomParameters(params) {
    // Mock implementation
  }
}

// Helper functions to match Firebase API
export const doc = (db, collection, id) => db.doc(`${collection}/${id}`)
export const setDoc = (docRef, data, options) => docRef.set(data, options)
export const getDoc = (docRef) => docRef.get()
export const collection = (db, name) => db.collection(name)
export const getDocs = (collectionRef) => collectionRef.get()
export const query = (collectionRef, ...constraints) => collectionRef
export const where = (field, op, value) => ({ field, op, value })
export const serverTimestamp = () => new Date()

export const signInWithPopup = (auth, provider) => auth.signInWithPopup(provider)
export const signOut = (auth) => auth.signOut()
export const onAuthStateChanged = (auth, callback) => auth.onAuthStateChanged(callback)
export const updateProfile = (user, profile) => Promise.resolve()

// Export mock instances
export const auth = new MockAuth()
export const googleProvider = new MockGoogleAuthProvider()
export const db = new MockFirestore()
export const storage = new MockStorage()

// Check if we're in demo mode
export const isDemoMode = true

console.warn('🚨 Running in DEMO MODE - Firebase services are mocked!')
console.info('📝 To use real Firebase, configure your .env file with Firebase credentials')
console.info('📖 See FIREBASE_SETUP_GUIDE.md for detailed instructions')

export default {
  auth,
  googleProvider,
  db,
  storage,
  isDemoMode
}
