import React, { useState, useEffect } from 'react'
import { Shield, Mail, Lock, AlertCircle, RefreshCw } from 'lucide-react'
import emailService from '../../../../services/emailService'
import toast from 'react-hot-toast'

export default function OTPModal({ isOpen, onClose, onSuccess, adminEmail }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 3

  useEffect(() => {
    // Only send OTP once when modal opens
    if (isOpen && !otpSent) {
      const timer = setTimeout(() => {
        sendOTP()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, otpSent])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const sendOTP = async () => {
    setLoading(true)
    try {
      const result = await emailService.sendOTPEmail(adminEmail, 'Admin')
      
      if (result.success) {
        setOtpSent(true)
        setResendTimer(60) // 60 seconds cooldown
        
        if (result.emailSkipped) {
          toast.error('Email service not configured. Check console for OTP.', { duration: 8000 })
        } else {
          toast.success(`OTP sent to ${adminEmail}`, { duration: 5000 })
        }
        
        // In development, show OTP in console
        if (import.meta.env.DEV && result.otp) {
          // console.log(`🔐 Payment Page OTP: ${result.otp}`)
        }
      } else {
        toast.error('Failed to send OTP. Please try again.')
      }
    } catch (error) {
      // console.error('Error sending OTP:', error)
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
      setOtp(newOtp)
    }
  }

  const verifyOTP = async () => {
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      toast.error('Please enter complete OTP')
      return
    }

    if (attempts >= maxAttempts) {
      toast.error('Maximum attempts exceeded. Please refresh and try again.')
      return
    }

    setLoading(true)
    setAttempts(attempts + 1)

    try {
      const result = await emailService.verifyOTP(adminEmail, otpCode)
      
      if (result.success) {
        toast.success('OTP verified successfully!')
        onSuccess()
      } else {
        toast.error(result.message || 'Invalid OTP')
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
        
        if (attempts + 1 >= maxAttempts) {
          toast.error('Maximum attempts exceeded. Please refresh and try again.')
        }
      }
    } catch (error) {
      // console.error('Error verifying OTP:', error)
      toast.error('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = () => {
    if (resendTimer === 0) {
      setOtp(['', '', '', '', '', ''])
      sendOTP()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Data Authentication
          </h2>
          <p className="text-gray-600">
            For security, please verify your identity to access payment information
          </p>
        </div>

        {/* Email Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">OTP sent to:</p>
              <p className="font-medium text-gray-900">{adminEmail}</p>
            </div>
          </div>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enter 6-digit OTP
          </label>
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        {/* Attempts Warning */}
        {attempts > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                {maxAttempts - attempts} attempt{maxAttempts - attempts !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
        )}

        {/* Resend OTP */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={resendOTP}
            disabled={resendTimer > 0 || loading}
            className={`text-sm ${
              resendTimer > 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:text-blue-700 cursor-pointer'
            } flex items-center space-x-1`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>
              {resendTimer > 0 
                ? `Resend OTP in ${resendTimer}s` 
                : 'Resend OTP'}
            </span>
          </button>
          <span className="text-xs text-gray-500">
            Valid for 10 minutes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={verifyOTP}
            disabled={loading || otp.join('').length !== 6}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Verify & Access
              </>
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Security Notice:</p>
              <p>This additional authentication is required to protect sensitive payment data. The OTP has been sent to the registered admin email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
