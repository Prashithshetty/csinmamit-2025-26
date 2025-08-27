/**
 * Secure Payment Service
 * Handles all payment-related operations with security measures
 */

import { 
  validatePaymentAmount, 
  generateTransactionId,
  sanitizeFormData 
} from '../utils/securityUtils'
import { membershipPlans } from '../data/membershipData'

class PaymentService {
  constructor() {
    this.razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    this.isTestMode = import.meta.env.VITE_APP_ENV !== 'production'
    this.rateLimitMap = new Map()
  }

  /**
   * Rate limiting for payment attempts
   */
  checkRateLimit(userId) {
    const now = Date.now()
    const userAttempts = this.rateLimitMap.get(userId) || []
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < 300000 // 5 minutes window
    )
    
    if (recentAttempts.length >= 3) {
      throw new Error('Too many payment attempts. Please try again later.')
    }
    
    recentAttempts.push(now)
    this.rateLimitMap.set(userId, recentAttempts)
    return true
  }

  /**
   * Validate payment data before processing
   */
  validatePaymentData(formData, selectedPlan) {
    const errors = []

    // Validate plan exists
    const plan = membershipPlans.find(p => p.id === selectedPlan)
    if (!plan) {
      errors.push('Invalid membership plan selected')
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'branch', 'year', 'usn']
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        errors.push(`${field} is required`)
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Invalid email format')
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.push('Invalid phone number')
    }

    // Validate USN format
    const usnRegex = /^[1-4]NM(2[0-9])[A-Z]{2}\d{3}$/i
    if (formData.usn && !usnRegex.test(formData.usn)) {
      errors.push('Invalid USN format')
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }

    return true
  }

  /**
   * Create payment order (should be done on backend in production)
   */
  async createOrder(userId, planId, formData) {
    try {
      // Check rate limiting
      this.checkRateLimit(userId)

      // Get plan details
      const plan = membershipPlans.find(p => p.id === planId)
      if (!plan) {
        throw new Error('Invalid plan selected')
      }

      // Validate form data
      this.validatePaymentData(formData, planId)

      // Sanitize form data
      const sanitizedData = sanitizeFormData(formData)

      // Generate secure transaction ID
      const transactionId = generateTransactionId()

      // In production, this should be an API call to your backend
      if (this.apiBaseUrl) {
        const response = await fetch(`${this.apiBaseUrl}/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': transactionId
          },
          body: JSON.stringify({
            userId,
            planId,
            amount: plan.price,
            formData: sanitizedData,
            transactionId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create payment order')
        }

        return await response.json()
      }

      return {
        orderId: `order_${transactionId}`,
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
        transactionId
      }
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  /**
   * Initialize Razorpay payment
   */
  async initializePayment(userId, planId, formData, onSuccess, onFailure) {
    try {
      // Validate Razorpay key exists
      if (!this.razorpayKeyId) {
        throw new Error('Payment gateway not configured')
      }

      // Create order
      const order = await this.createOrder(userId, planId, formData)
      const plan = membershipPlans.find(p => p.id === planId)

      // Razorpay options
      const options = {
        key: this.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'CSI NMAMIT',
        description: `${plan.name} - ${plan.duration}`,
        image: '/csi-logo.png',
        order_id: order.orderId,
        handler: async (response) => {
          // Verify payment on backend
          await this.verifyPayment(response, order.transactionId, onSuccess)
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          userId,
          planId,
          transactionId: order.transactionId
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: () => {
            onFailure('Payment cancelled by user')
          }
        }
      }

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment initialization error:', error)
      onFailure(error.message)
    }
  }

  /**
   * Verify payment (MUST be done on backend in production)
   */
  async verifyPayment(paymentResponse, transactionId, onSuccess) {
    try {
      if (this.apiBaseUrl) {
        // Production: Verify on backend
        const response = await fetch(`${this.apiBaseUrl}/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Transaction-ID': transactionId
          },
          body: JSON.stringify({
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            transactionId
          })
        })

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        const result = await response.json()
        if (result.verified) {
          onSuccess(result)
        } else {
          throw new Error('Payment verification failed')
        }
      } else {
        console.warn('Payment verification should be done on backend')
        onSuccess({
          paymentId: paymentResponse.razorpay_payment_id,
          transactionId
        })
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      throw error
    }
  }

  /**
   * Load Razorpay script securely
   */
  loadRazorpayScript() {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.defer = true
      
      // Add integrity check if available
      script.crossOrigin = 'anonymous'
      
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      
      document.body.appendChild(script)
    })
  }
}

// Export singleton instance
export default new PaymentService()
