import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { 
  Shield, 
  Lock, 
  Mail, 
  Key, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    adminUser, 
    signInAdminWithGoogle, 
    verifyOTP, 
    resendOTP,
    otpSent,
    pendingAdmin,
    authLoading 
  } = useAdminAuth()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const from = location.state?.from?.pathname || '/admin/dashboard'

  // Redirect if already authenticated
  useEffect(() => {
    if (adminUser) {
      navigate(from, { replace: true })
    }
  }, [adminUser, navigate, from])

  // Handle resend timer
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
      setResendTimer(30) // 30 seconds before allowing resend
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value) {
      const fullOtp = newOtp.join('')
      if (fullOtp.length === 6) {
        handleOtpSubmit(fullOtp)
      }
    }
  }

  // Handle OTP key events
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)
    
    if (pastedData.length === 6) {
      handleOtpSubmit(pastedData)
    }
  }

  // Submit OTP
  const handleOtpSubmit = async (otpValue = otp.join('')) => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter all 6 digits')
      return
    }

    try {
      const success = await verifyOTP(otpValue)
      if (success) {
        navigate(from, { replace: true })
      } else {
        setOtpError('Invalid or expired OTP')
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      }
    } catch (error) {
      setOtpError('Verification failed. Please try again.')
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    try {
      await resendOTP()
      setResendTimer(30)
      toast.success('OTP resent successfully')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } catch (error) {
      toast.error('Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-2xl"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">CSI NMAMIT Administrative Access</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
        >
          {!otpSent ? (
            // Step 1: Google Sign In
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Secure Admin Login</h2>
                <p className="text-gray-400 text-sm">
                  Sign in with your authorized Google account to continue
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-yellow-500 font-medium text-sm">Security Notice</p>
                    <p className="text-gray-400 text-xs mt-1">
                      This area is restricted to authorized administrators only. 
                      All access attempts are logged and monitored.
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Two-factor authentication required</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">OTP verification via email</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Session expires after 30 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: OTP Verification
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Verify Your Identity</h2>
                <p className="text-gray-400 text-sm">
                  Enter the 6-digit code sent to {pendingAdmin?.email}
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex justify-center space-x-2 mb-4">
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
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      autoComplete="off"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm text-center">{otpError}</p>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleOtpSubmit()}
                disabled={authLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Verify OTP</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-gray-400 hover:text-white text-sm transition-colors disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? (
                    `Resend OTP in ${resendTimer}s`
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>

              {/* Back Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>© 2024 CSI NMAMIT. All rights reserved.</p>
          <p className="mt-1">Your IP address and activity are being logged.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
