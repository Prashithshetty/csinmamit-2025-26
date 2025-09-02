/**
 * Email Service for Frontend
 * Handles OTP email sending directly through EmailJS SMTP service
 * Works without backend - sends emails directly from the browser
 */

import { 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import crypto from 'crypto-js'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, validateEmailJSConfig, createOTPEmailParams } from '../config/emailjs'

class EmailService {
  constructor() {
    // Initialize EmailJS with public key
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    }
    
    // OTP configuration
    this.otpCollection = 'adminOTPs'
    this.otpExpiryTime = 10 * 60 * 1000 // 10 minutes
    
    // Validate EmailJS configuration on initialization
    this.isConfigured = validateEmailJSConfig()
  }

  /**
   * Generate a secure OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Hash OTP for secure storage
   */
  hashOTP(otp) {
    return crypto.SHA256(otp).toString()
  }

  /**
   * Send OTP email using EmailJS SMTP Service
   * This sends emails directly from the browser without backend
   */
  async sendOTPEmail(email, name) {
    try {
      // Debug: Log configuration status
      // console.log('📧 EmailJS Configuration Check:')
      // console.log('SERVICE_ID:', EMAILJS_CONFIG.SERVICE_ID ? '✅ Set' : '❌ Missing')
      // console.log('OTP_TEMPLATE_ID:', EMAILJS_CONFIG.OTP_TEMPLATE_ID ? '✅ Set' : '❌ Missing')
      // console.log('PUBLIC_KEY:', EMAILJS_CONFIG.PUBLIC_KEY ? '✅ Set' : '❌ Missing')
      // console.log('Is Configured:', this.isConfigured)
      
      // Check if EmailJS is configured
      if (!this.isConfigured) {
        // console.warn('⚠️ EmailJS not configured. Please set up environment variables.')
        // console.warn('Missing configuration:', {
        //   SERVICE_ID: !EMAILJS_CONFIG.SERVICE_ID,
        //   OTP_TEMPLATE_ID: !EMAILJS_CONFIG.OTP_TEMPLATE_ID,
        //   PUBLIC_KEY: !EMAILJS_CONFIG.PUBLIC_KEY
        // })
        // console.warn('Please check your .env.local file has these variables:')
        // console.warn('VITE_EMAILJS_SERVICE_ID=your_service_id')
        // console.warn('VITE_EMAILJS_OTP_TEMPLATE_ID=your_template_id')
        // console.warn('VITE_EMAILJS_PUBLIC_KEY=your_public_key')
        
        // In development, still generate and return OTP for testing
        if (import.meta.env.DEV) {
          const otp = this.generateOTP()
          const hashedOTP = this.hashOTP(otp)
          const expiryTime = Date.now() + this.otpExpiryTime
          
          // Store OTP in Firestore even if email isn't sent
          const otpRef = doc(db, this.otpCollection, email)
          await setDoc(otpRef, {
            otp: hashedOTP,
            email: email,
            expiryTime: expiryTime,
            used: false,
            createdAt: serverTimestamp(),
            attempts: 0
          })
          
          // console.log(`🔐 Development OTP for ${email}: ${otp}`)
          return { success: true, otp: otp, emailSkipped: true }
        }
        
        throw new Error('Email service not configured. Please contact administrator.')
      }

      // Generate OTP
      const otp = this.generateOTP()
      const hashedOTP = this.hashOTP(otp)
      const expiryTime = Date.now() + this.otpExpiryTime

      // console.log('📧 Attempting to send OTP email to:', email)
      // console.log('Using EmailJS Service ID:', EMAILJS_CONFIG.SERVICE_ID)
      // console.log('Using Template ID:', EMAILJS_CONFIG.OTP_TEMPLATE_ID)

      // Store OTP in Firestore (hashed for security)
      const otpRef = doc(db, this.otpCollection, email)
      await setDoc(otpRef, {
        otp: hashedOTP,
        email: email,
        expiryTime: expiryTime,
        used: false,
        createdAt: serverTimestamp(),
        attempts: 0
      })
      // console.log('✅ OTP stored in Firestore')

      // Prepare email parameters for EmailJS template
      const templateParams = createOTPEmailParams(email, name, otp)
      // console.log('📧 Template parameters prepared:')
      // console.log('  Email fields:', {
      //   to_email: templateParams.to_email,
      //   user_email: templateParams.user_email,
      //   email: templateParams.email,
      //   recipient_email: templateParams.recipient_email
      // })
      // console.log('  Name:', templateParams.to_name)
      // console.log('  OTP: ******')
      // console.log('  Full params:', { ...templateParams, otp_code: '******', otp: '******', code: '******' })

      // Send email using EmailJS
      // console.log('📧 Sending email via EmailJS...')
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.OTP_TEMPLATE_ID,
        templateParams
      )

      // console.log('📧 EmailJS Response:', response)

      if (response.status === 200) {
        // console.log(`✅ OTP email sent successfully to ${email}`)
        // console.log('Check your email inbox and spam folder')
        
        // Return success without OTP in production
        if (import.meta.env.PROD) {
          return { success: true }
        }
        
        // In development, also return the OTP for testing
        // console.log(`🔐 Development OTP for ${email}: ${otp}`)
        return { success: true, otp: import.meta.env.DEV ? otp : undefined }
      } else {
        throw new Error(`EmailJS failed with status: ${response.status}`)
      }
    } catch (error) {
      // console.error('❌ Error sending OTP email:', error)
      // console.error('Error details:', {
      //   message: error.message,
      //   text: error.text,
      //   status: error.status
      // })
      
      // Check for common EmailJS errors
      if (error.text?.includes('The Public Key is invalid')) {
        // console.error('❌ Invalid EmailJS Public Key. Please check your VITE_EMAILJS_PUBLIC_KEY in .env.local')
      } else if (error.text?.includes('The Service ID is invalid')) {
        // console.error('❌ Invalid EmailJS Service ID. Please check your VITE_EMAILJS_SERVICE_ID in .env.local')
      } else if (error.text?.includes('The Template ID is invalid')) {
        // console.error('❌ Invalid EmailJS Template ID. Please check your VITE_EMAILJS_OTP_TEMPLATE_ID in .env.local')
      } else if (error.text?.includes('The daily quota')) {
        // console.error('❌ EmailJS daily quota exceeded. Please upgrade your plan or wait until tomorrow.')
      }
      
      // If EmailJS fails in development, still return OTP for testing
      if (import.meta.env.DEV) {
        // console.warn('⚠️ Email sending failed, but returning OTP for development testing')
        const otp = this.generateOTP()
        const hashedOTP = this.hashOTP(otp)
        const expiryTime = Date.now() + this.otpExpiryTime
        
        // Store OTP in Firestore
        const otpRef = doc(db, this.otpCollection, email)
        await setDoc(otpRef, {
          otp: hashedOTP,
          email: email,
          expiryTime: expiryTime,
          used: false,
          createdAt: serverTimestamp(),
          attempts: 0
        })
        
        // console.log(`🔐 Development OTP for ${email}: ${otp}`)
        return { success: true, otp: otp, emailError: true }
      }
      
      throw error
    }
  }

  /**
   * Send custom email using EmailJS
   * Can be used for other email types in the future
   */
  async sendCustomEmail(templateId, templateParams) {
    try {
      if (!this.isConfigured) {
        throw new Error('Email service not configured')
      }

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        templateId,
        templateParams
      )

      return {
        success: response.status === 200,
        response: response
      }
    } catch (error) {
      // console.error('Error sending custom email:', error)
      throw error
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email, inputOTP) {
    try {
      // Get OTP document
      const otpRef = doc(db, this.otpCollection, email)
      const otpDoc = await getDoc(otpRef)

      if (!otpDoc.exists()) {
        return {
          success: false,
          message: 'OTP not found'
        }
      }

      const otpData = otpDoc.data()

      // Check if OTP is already used
      if (otpData.used) {
        return {
          success: false,
          message: 'OTP already used'
        }
      }

      // Check if OTP is expired
      if (Date.now() > otpData.expiryTime) {
        return {
          success: false,
          message: 'OTP expired'
        }
      }

      // Increment attempts
      await updateDoc(otpRef, {
        attempts: (otpData.attempts || 0) + 1
      })

      // Check if too many attempts
      if (otpData.attempts >= 5) {
        await updateDoc(otpRef, { used: true })
        return {
          success: false,
          message: 'Too many attempts. Please request a new OTP'
        }
      }

      // Verify OTP (compare hashed values)
      const hashedInput = this.hashOTP(inputOTP)
      if (otpData.otp !== hashedInput) {
        return {
          success: false,
          message: 'Invalid OTP'
        }
      }

      // Mark OTP as used
      await updateDoc(otpRef, { used: true })

      return {
        success: true,
        message: 'OTP verified successfully'
      }
    } catch (error) {
      // console.error('Error verifying OTP:', error)
      throw error
    }
  }

}

// Export singleton instance
export default new EmailService()
