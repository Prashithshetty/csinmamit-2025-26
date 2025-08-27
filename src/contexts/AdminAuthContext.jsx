import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider, db, isDemoMode } from '../config/firebase'
import { 
  signInWithPopup as firebaseSignInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth'
import { 
  doc as firebaseDoc,
  setDoc as firebaseSetDoc,
  getDoc as firebaseGetDoc,
  serverTimestamp as firebaseServerTimestamp,
  collection as firebaseCollection
} from 'firebase/firestore'
import toast from 'react-hot-toast'

// Use appropriate functions based on mode
let signInWithPopup, signOut, onAuthStateChanged
let doc, setDoc, getDoc, serverTimestamp, collection

if (isDemoMode) {
  // Use mock functions from demo
  signInWithPopup = (auth, provider) => auth.signInWithPopup(provider)
  signOut = (auth) => auth.signOut()
  onAuthStateChanged = (auth, callback) => auth.onAuthStateChanged(callback)
  
  // Mock Firestore functions
  doc = (db, collectionName, id) => db.doc(`${collectionName}/${id}`)
  setDoc = (docRef, data, options) => docRef.set(data, options)
  getDoc = (docRef) => docRef.get()
  serverTimestamp = () => new Date()
  collection = (db, name) => db.collection(name)
} else {
  // Use real Firebase functions
  signInWithPopup = firebaseSignInWithPopup
  signOut = firebaseSignOut
  onAuthStateChanged = firebaseOnAuthStateChanged
  doc = firebaseDoc
  setDoc = firebaseSetDoc
  getDoc = firebaseGetDoc
  serverTimestamp = firebaseServerTimestamp
  collection = firebaseCollection
}

const AdminAuthContext = createContext({})

export const useAdminAuth = () => useContext(AdminAuthContext)

// Admin whitelist - Add admin emails here
const ADMIN_WHITELIST = [
  'admin@csinmamit.com',
  'csi@nmamit.in',
  // Add more admin emails as needed
]

// OTP configuration
const OTP_EXPIRY_TIME = 10 * 60 * 1000 // 10 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [sessionExpiry, setSessionExpiry] = useState(null)
  const [pendingAdmin, setPendingAdmin] = useState(null)

  // Generate OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Check if user is whitelisted admin
  const isWhitelistedAdmin = (email) => {
    // In demo mode, always return true for demo admin email
    if (isDemoMode && email === 'admin@csinmamit.com') {
      return true
    }
    return ADMIN_WHITELIST.includes(email.toLowerCase())
  }

  // Sign in with Google (Step 1)
  const signInAdminWithGoogle = async () => {
    setAuthLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // In demo mode, simulate admin user
      if (isDemoMode) {
        user.email = 'admin@csinmamit.com'
        user.displayName = 'Admin User'
      }
      
      // Check if user is in admin whitelist
      if (!isWhitelistedAdmin(user.email)) {
        await signOut(auth)
        toast.error('Unauthorized: You are not an admin')
        return null
      }

      // Store pending admin for OTP verification
      setPendingAdmin({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      })

      // Generate and send OTP
      await sendOTPEmail(user.email, user.displayName)
      
      return user
    } catch (error) {
      console.error('Error signing in:', error)
      toast.error('Failed to sign in. Please try again.')
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  // Send OTP Email (Step 2)
  const sendOTPEmail = async (email, name) => {
    try {
      const otp = generateOTP()
      const expiryTime = Date.now() + OTP_EXPIRY_TIME
      
      // Store OTP in Firestore (in production, use Cloud Functions)
      const otpRef = doc(db, 'adminOTPs', email)
      await setDoc(otpRef, {
        otp: otp, // In production, hash this
        email: email,
        expiryTime: expiryTime,
        used: false,
        createdAt: serverTimestamp()
      })

      // In demo mode or development, show OTP in console
      console.log(`🔐 OTP for ${email}: ${otp}`)
      
      if (isDemoMode) {
        toast.success(`Demo OTP: ${otp}`, { duration: 10000 })
      } else {
        toast.success(`OTP sent to ${email}. Check console for demo.`)
      }
      
      setOtpSent(true)
      
      // Auto-expire OTP
      setTimeout(() => {
        setOtpSent(false)
      }, OTP_EXPIRY_TIME)
      
      return true
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Failed to send OTP')
      return false
    }
  }

  // Verify OTP (Step 3)
  const verifyOTP = async (inputOTP) => {
    if (!pendingAdmin) {
      toast.error('No pending admin login')
      return false
    }

    setAuthLoading(true)
    try {
      // Get OTP from Firestore
      const otpRef = doc(db, 'adminOTPs', pendingAdmin.email)
      const otpDoc = await getDoc(otpRef)
      
      if (!otpDoc.exists()) {
        toast.error('OTP not found')
        return false
      }

      const otpData = otpDoc.data()
      
      // Check if OTP is valid
      if (otpData.used) {
        toast.error('OTP already used')
        return false
      }

      if (Date.now() > otpData.expiryTime) {
        toast.error('OTP expired')
        return false
      }

      if (otpData.otp !== inputOTP) {
        toast.error('Invalid OTP')
        return false
      }

      // Mark OTP as used
      await setDoc(otpRef, { used: true }, { merge: true })

      // Create/update admin user in Firestore
      const adminRef = doc(db, 'admins', pendingAdmin.uid)
      await setDoc(adminRef, {
        uid: pendingAdmin.uid,
        email: pendingAdmin.email,
        name: pendingAdmin.name,
        photoURL: pendingAdmin.photoURL,
        role: 'admin',
        verified: true,
        lastLogin: serverTimestamp(),
        loginHistory: [],
        permissions: {
          users: true,
          events: true,
          members: true,
          content: true,
          settings: true
        }
      }, { merge: true })

      // Set admin session
      const sessionExp = Date.now() + SESSION_TIMEOUT
      setSessionExpiry(sessionExp)
      
      // Store session in localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        uid: pendingAdmin.uid,
        expiry: sessionExp
      }))

      setAdminUser({
        ...pendingAdmin,
        role: 'admin',
        verified: true
      })

      setPendingAdmin(null)
      setOtpSent(false)
      
      toast.success('Admin login successful!')
      return true
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('Failed to verify OTP')
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  // Resend OTP
  const resendOTP = async () => {
    if (!pendingAdmin) {
      toast.error('No pending admin login')
      return false
    }

    return await sendOTPEmail(pendingAdmin.email, pendingAdmin.name)
  }

  // Admin logout
  const logoutAdmin = async () => {
    setAuthLoading(true)
    try {
      await signOut(auth)
      setAdminUser(null)
      setPendingAdmin(null)
      setOtpSent(false)
      setSessionExpiry(null)
      localStorage.removeItem('adminSession')
      toast.success('Admin logged out successfully')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to logout')
    } finally {
      setAuthLoading(false)
    }
  }

  // Check admin status
  const checkAdminStatus = async (uid) => {
    try {
      const adminRef = doc(db, 'admins', uid)
      const adminDoc = await getDoc(adminRef)
      
      if (adminDoc.exists() && adminDoc.data().verified) {
        return adminDoc.data()
      }
      return null
    } catch (error) {
      console.error('Error checking admin status:', error)
      return null
    }
  }

  // Session management
  useEffect(() => {
    if (sessionExpiry) {
      const checkSession = setInterval(() => {
        if (Date.now() > sessionExpiry) {
          toast.error('Admin session expired')
          logoutAdmin()
        }
      }, 60000) // Check every minute

      return () => clearInterval(checkSession)
    }
  }, [sessionExpiry])

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const storedSession = localStorage.getItem('adminSession')
      
      if (storedSession) {
        const session = JSON.parse(storedSession)
        
        if (Date.now() < session.expiry) {
          // Session still valid, restore admin user
          const adminData = await checkAdminStatus(session.uid)
          if (adminData) {
            setAdminUser(adminData)
            setSessionExpiry(session.expiry)
          } else {
            localStorage.removeItem('adminSession')
          }
        } else {
          localStorage.removeItem('adminSession')
        }
      }
      
      setLoading(false)
    }

    checkExistingSession()
  }, [])

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && adminUser) {
        // Keep admin user in sync
        const adminData = await checkAdminStatus(firebaseUser.uid)
        if (adminData) {
          setAdminUser({
            ...adminData,
            uid: firebaseUser.uid
          })
        }
      }
    })

    return unsubscribe
  }, [adminUser])

  // Activity logging
  const logAdminActivity = async (action, details = {}) => {
    if (!adminUser) return

    try {
      const activityRef = doc(collection(db, 'adminActivity'))
      await setDoc(activityRef, {
        adminId: adminUser.uid,
        adminEmail: adminUser.email,
        action: action,
        details: details,
        timestamp: serverTimestamp(),
        ip: window.location.hostname // In production, get actual IP
      })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  const value = {
    adminUser,
    loading,
    authLoading,
    otpSent,
    pendingAdmin,
    sessionExpiry,
    signInAdminWithGoogle,
    verifyOTP,
    resendOTP,
    logoutAdmin,
    checkAdminStatus,
    logAdminActivity,
    isWhitelistedAdmin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
