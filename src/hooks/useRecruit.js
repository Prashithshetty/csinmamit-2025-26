import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { membershipPlans } from '../data/membershipData'

/**
 * Custom hook for managing recruitment/membership registration
 */
export const useRecruit = () => {
  const navigate = useNavigate()
  const { user, signInWithGoogle, isProfileIncomplete } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('1year')
  const [loading, setLoading] = useState(false)

  // Initialize form data from user profile
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || user?.phone || '',
    branch: user?.profile?.branch || user?.branch || '',
    year: user?.profile?.year || user?.year || '',
    usn: user?.profile?.usn || user?.usn || '',
    whyJoin: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone ||
      !formData.branch || !formData.year || !formData.usn) {
      toast.error('Please fill all required fields')
      return false
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return false
    }

    return true
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to continue')
      return
    }

    // if (!validateForm()) {
    //   return
    // }

    setLoading(true)

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript()
      if (!res) {
        toast.error('Failed to load payment gateway')
        return
      }

      // Get selected plan
      const plan = membershipPlans.find(p => p.id === selectedPlan)

      // Create order via backend
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
      const response = await fetch(`${backendUrl}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          userId: user.uid
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await response.json()

      // Initialize Razorpay
      const options = {
        key: orderData.keyId, // Key ID from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CSI NMAMIT',
        description: `${plan.name} - ${plan.duration}`,
        image: '/csi-logo.png',
        order_id: orderData.orderId, // Order ID from backend
        handler: function (response) {
          // Handle successful payment
          toast.success('Payment successful! Welcome to CSI NMAMIT!')
          // console.log('Payment ID:', response.razorpay_payment_id)

          // Update user membership status (in production, verify payment on backend)
          // Then redirect to profile
          setTimeout(() => {
            navigate('/profile')
          }, 2000)
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          userId: user.uid,
          planId: plan.id,
          planName: plan.name
        },
        theme: {
          color: '#3b82f6'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      // console.error('Payment error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handlePayment()
  }

  return {
    formData,
    loading,
    selectedPlan,
    setSelectedPlan,
    handleInputChange,
    handleSubmit,
    signInWithGoogle,
    isProfileIncomplete
  }
}
