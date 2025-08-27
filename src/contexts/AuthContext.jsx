import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../config/firebase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)

  // Sign in with Google
  const signInWithGoogle = async () => {
    setAuthLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: 'member',
          joinedAt: serverTimestamp(),
          membership: {
            status: 'inactive',
            type: null,
            expiresAt: null
          },
          profile: {
            phone: '',
            college: 'NMAMIT',
            branch: '',
            year: '',
            bio: ''
          }
        })
        toast.success('Welcome to CSI NMAMIT!')
      } else {
        toast.success(`Welcome back, ${user.displayName}!`)
      }
      
      return user
    } catch (error) {
      console.error('Error signing in:', error)
      toast.error('Failed to sign in. Please try again.')
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign out
  const logout = async () => {
    setAuthLoading(true)
    try {
      await signOut(auth)
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!user) return
    
    try {
      // Update Firebase Auth profile if name or photo changed
      if (updates.name || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        })
      }
      
      // Update Firestore document
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, updates, { merge: true })
      
      // Update local state
      setUser(prev => ({ ...prev, ...updates }))
      
      toast.success('Profile updated successfully')
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      return false
    }
  }

  // Check if profile is complete
  const checkProfileCompletion = async (userData = null) => {
    try {
      let data = userData
      
      // If no data provided, fetch from current user
      if (!data && user?.uid) {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          data = userSnap.data()
        }
      }
      
      if (!data) {
        setIsProfileIncomplete(false)
        return false
      }
      
      // Check required fields for profile completion
      const requiredFields = ['name', 'phone', 'branch', 'year', 'usn']
      const isIncomplete = requiredFields.some(field => {
        const value = data[field] || data.profile?.[field]
        return !value || value === ''
      })
      
      setIsProfileIncomplete(isIncomplete)
      return !isIncomplete
    } catch (error) {
      console.error('Error checking profile completion:', error)
      setIsProfileIncomplete(false)
      return false
    }
  }

  // Get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        return userSnap.data()
      }
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userData = await getUserData(firebaseUser.uid)
        
        const fullUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userData
        }
        
        setUser(fullUserData)
        
        // Check if profile is complete
        await checkProfileCompletion(fullUserData)
      } else {
        setUser(null)
        setIsProfileIncomplete(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    authLoading,
    isProfileIncomplete,
    signInWithGoogle,
    logout,
    updateUserProfile,
    getUserData,
    checkProfileCompletion
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
