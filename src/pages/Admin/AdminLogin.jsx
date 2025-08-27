import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Mail, 
  Key, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Clock,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { 
    adminUser,
    authLoading,
    otpSent,
    pendingAdmin,
    signInAdminWithGoogle,
    verifyOTP,
    resendOTP
  } = useAdminAuth()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)
  const [verifying, setVerifying] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (adminUser) {
      navigate('/admin/dashboard')
    }
  }, [adminUser, navigate])

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signInAdminWithGoogle()
      setResendTimer(60) // Start 60 second timer for resend
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  // Handle OTP key down
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/[0-9]/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }
    
    setOtp(newOtp)
  }

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP')
      return
    }

    setVerifying(true)
    try {
      const success = await verifyOTP(otpString)
      if (success) {
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
    } finally {
      setVerifying(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    
    try {
      await resendOTP()
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
      toast.success('OTP resent successfully!')
    } catch (error) {
      console.error('Resend OTP error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Django-style Login Box */}
        <div className="bg-white border border-[#ddd] rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#417690] text-white p-4">
            <h1 className="text-lg font-normal">CSI NMAMIT administration</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {!otpSent ? (
                // Step 1: Google Sign In
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-xl font-normal text-[#333] mb-6">Admin Login</h2>
                  
                  <div className="mb-6">
                    <div className="bg-[#d1ecf1] border border-[#bee5eb] rounded p-3 text-sm text-[#0c5460]">
                      <AlertCircle className="inline w-4 h-4 mr-2" />
                      Only authorized administrators can access this area
                    </div>
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border border-[#ddd] rounded hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-[#417690]" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-[#333]">Sign in with Google</span>
                      </>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-[#666]">
                      After signing in, you'll receive an OTP for verification
                    </p>
                  </div>
                </motion.div>
              ) : (
                // Step 2: OTP Verification
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-normal text-[#333] mb-2">Verify OTP</h2>
                  
                  {pendingAdmin && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 p-3 bg-[#f8f8f8] rounded">
                        {pendingAdmin.photoURL ? (
                          <img 
                            src={pendingAdmin.photoURL} 
                            alt={pendingAdmin.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#417690] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-[#333]">{pendingAdmin.name}</p>
                          <p className="text-xs text-[#666]">{pendingAdmin.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-[#666] mb-4">
                      Enter the 6-digit code sent to your email
                    </p>
                    
                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-12 text-center text-lg font-semibold border border-[#ccc] rounded focus:outline-none focus:border-[#79aec8] focus:ring-1 focus:ring-[#79aec8]"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={verifying || otp.join('').length !== 6}
                    className="w-full px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067] focus:outline-none focus:ring-2 focus:ring-[#79aec8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {verifying ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify OTP
                      </span>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0}
                      className="text-sm text-[#417690] hover:text-[#205067] disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Resend OTP
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => window.location.reload()}
                      className="text-sm text-[#ba2121] hover:text-[#8a1919]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="mt-6 p-3 bg-[#fff3cd] border border-[#ffeeba] rounded">
                    <p className="text-xs text-[#856404]">
                      <AlertCircle className="inline w-3 h-3 mr-1" />
                      OTP expires in 10 minutes. Check your spam folder if you don't see the email.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Secure admin access with two-factor authentication
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
