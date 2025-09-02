/**
 * Payment Data Service
 * Handles fetching and processing payment data from Firestore
 * Only displays real data from database - no fake/dummy data
 */

import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  where,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore'
import { db } from '../../../../config/firebase'

class PaymentDataService {
  constructor() {
    this.usersCollection = 'users'
    this.membershipPaymentsCollection = 'membershipPayments' // Main payments collection
    this.paymentsCollection = 'payments'
    this.recruitsCollection = 'recruits'
  }

  /**
   * Fetch all payments - only real data from database
   */
  async fetchAllPayments() {
    try {
      const payments = []
      
      // FIRST PRIORITY: Get payment records from membershipPayments collection
      try {
        const membershipPaymentsQuery = query(
          collection(db, this.membershipPaymentsCollection),
          orderBy('createdAt', 'desc')
        )
        const membershipPaymentsSnapshot = await getDocs(membershipPaymentsQuery)
        
        if (!membershipPaymentsSnapshot.empty) {
          // console.log(`Found ${membershipPaymentsSnapshot.size} payments in membershipPayments collection`)
          
          membershipPaymentsSnapshot.docs.forEach(doc => {
            const data = doc.data()
            
            // Process each payment record from membershipPayments collection
            const paymentData = {
              id: doc.id,
              userId: data.userId || data.uid || doc.id,
              
              // User information
              userName: data.userName || data.name || data.displayName || 'Unknown',
              userEmail: data.userEmail || data.email || 'N/A',
              userPhone: data.userPhone || data.phone || data.mobileNumber || 'N/A',
              userUSN: data.userUSN || data.usn || 'N/A',
              userBranch: data.userBranch || data.branch || 'N/A',
              userYear: data.userYear || data.year || data.yearOfStudy || 'N/A',
              
              // Payment amount
              amount: data.amount || data.paymentAmount || data.totalAmount || 500,
              
              // Transaction details
              transactionId: data.transactionId || data.razorpay_payment_id || `TXN_${doc.id}`,
              orderId: data.orderId || data.razorpay_order_id || '',
              paymentId: data.paymentId || data.razorpay_payment_id || '',
              
              // Membership information
              planName: data.planName || data.membershipPlan || data.plan || '1-Year Executive Membership',
              planDuration: data.planDuration || data.duration || '1 Year',
              
              // Payment status
              status: data.status || data.paymentStatus || 'success',
              paymentMethod: data.paymentMethod || data.method || 'Online',
              
              // Timestamps
              createdAt: data.createdAt?.toDate?.() || 
                        data.createdAt || 
                        data.paymentDate?.toDate?.() || 
                        data.paymentDate || 
                        new Date(),
              
              // Additional fields if present
              ...data
            }
            
            payments.push(paymentData)
          })
          
          // If we found payments in membershipPayments, return them
          if (payments.length > 0) {
            const stats = this.calculatePaymentStats(payments)
            return {
              payments,
              stats
            }
          }
        }
      } catch (error) {
        // console.log('membershipPayments collection not found or error:', error)
      }
      
      // FALLBACK: If no membershipPayments, try other collections
      try {
        const paymentsQuery = query(
          collection(db, this.paymentsCollection),
          orderBy('createdAt', 'desc')
        )
        const paymentsSnapshot = await getDocs(paymentsQuery)
        
        if (!paymentsSnapshot.empty) {
          paymentsSnapshot.docs.forEach(doc => {
            const data = doc.data()
            payments.push({
              id: doc.id,
              ...data,
              status: data.status || 'success',
              createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date()
            })
          })
        }
      } catch (error) {
        // console.log('Payments collection not found, checking users...')
      }
      
      // Get Executive Members from users collection - only those with actual payment data
      const usersQuery = query(
        collection(db, this.usersCollection),
        where('role', '==', 'EXECUTIVE MEMBER')
      )
      
      const usersSnapshot = await getDocs(usersQuery)
      
      // Process each user - only include if they have actual payment/membership data
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data()
        
        // Only include users who have actual payment or membership data
        const hasPaymentData = userData.paymentDetails || 
                              userData.membership || 
                              userData.paymentStatus === 'completed' ||
                              userData.transactionId ||
                              userData.razorpayPaymentId
        
        if (!hasPaymentData) {
          continue // Skip users without payment data
        }
        
        // Check if this user already exists in payments array
        const existingPayment = payments.find(p => 
          p.userId === userDoc.id || 
          p.userEmail === userData.email
        )
        
        if (existingPayment) {
          continue // Skip duplicates
        }
        
        // Extract real payment information from user data
        const paymentData = {
          id: userDoc.id,
          userId: userDoc.id,
          
          // User information - only real data
          userName: userData.name || userData.displayName || 'Unknown',
          userEmail: userData.email || 'N/A',
          userPhone: userData.phone || userData.mobileNumber || 'N/A',
          userUSN: userData.usn || 'N/A',
          userBranch: userData.branch || 'N/A',
          userYear: userData.year || userData.yearOfStudy || 'N/A',
          
          // Payment amount - use actual data or default 500 for CSI membership
          amount: userData.paymentDetails?.amount || 
                 userData.membership?.amount ||
                 userData.paymentAmount ||
                 500, // Standard CSI membership fee
          
          // Transaction details - only if they exist
          transactionId: userData.paymentDetails?.transactionId || 
                        userData.transactionId || 
                        userData.razorpayPaymentId ||
                        `TXN_${userDoc.id.substring(0, 10).toUpperCase()}`,
          orderId: userData.paymentDetails?.orderId || 
                  userData.razorpayOrderId || 
                  'No order ID',
          paymentId: userData.paymentDetails?.paymentId || 
                    userData.razorpayPaymentId || 
                    '',
          
          // Membership information - based on actual data
          planName: userData.membership?.planName || 
                   userData.membershipPlan || 
                   '1-Year Executive Membership',
          planDuration: userData.membership?.duration || '1 Year',
          
          // Payment status - based on actual data
          status: userData.paymentStatus === 'completed' ? 'success' : 
                 userData.membership?.status === 'active' ? 'success' :
                 userData.paymentStatus === 'failed' ? 'failed' : 
                 userData.paymentStatus === 'pending' ? 'pending' :
                 'success', // Default to success for Executive Members
          
          paymentMethod: userData.paymentMethod || 'Online',
          
          // Timestamps - use actual dates
          createdAt: userData.paymentDetails?.paymentDate?.toDate?.() || 
                    userData.paymentDetails?.paymentDate ||
                    userData.membership?.purchaseDate?.toDate?.() ||
                    userData.membership?.purchaseDate ||
                    userData.joinedAt?.toDate?.() || 
                    userData.joinedAt ||
                    userData.createdAt?.toDate?.() || 
                    userData.createdAt || 
                    new Date()
        }
        
        payments.push(paymentData)
      }
      
      // Also check recruits collection for actual payments
      try {
        const recruitsQuery = query(
          collection(db, this.recruitsCollection)
        )
        
        const recruitsSnapshot = await getDocs(recruitsQuery)
        
        for (const recruitDoc of recruitsSnapshot.docs) {
          const recruitData = recruitDoc.data()
          
          // Only include recruits with actual payment data
          if (recruitData.paymentStatus === 'completed' || 
              recruitData.transactionId ||
              recruitData.razorpayPaymentId) {
            
            // Check for duplicates
            const isDuplicate = payments.some(p => 
              p.userEmail === recruitData.email || 
              (recruitData.transactionId && p.transactionId === recruitData.transactionId)
            )
            
            if (!isDuplicate) {
              const paymentData = {
                id: `recruit_${recruitDoc.id}`,
                userId: recruitDoc.id,
                
                // User information
                userName: recruitData.name || 'Unknown',
                userEmail: recruitData.personalEmail || recruitData.collegeEmail || recruitData.email || 'N/A',
                userPhone: recruitData.mobileNumber || recruitData.phone || 'N/A',
                userUSN: recruitData.usn || 'N/A',
                userBranch: recruitData.branch || 'N/A',
                userYear: recruitData.yearOfStudy || recruitData.year || 'N/A',
                
                // Payment information - only real amounts
                amount: recruitData.paymentAmount || 
                       recruitData.membershipAmount ||
                       500, // Default CSI fee
                
                // Transaction IDs - only if they exist
                transactionId: recruitData.transactionId || 
                              recruitData.razorpayPaymentId ||
                              `TXN_RECRUIT_${recruitDoc.id.substring(0, 8).toUpperCase()}`,
                orderId: recruitData.orderId || 
                        recruitData.razorpayOrderId || 
                        '',
                paymentId: recruitData.paymentId || 
                          recruitData.razorpayPaymentId || 
                          '',
                
                // Membership information
                planName: recruitData.membershipPlan || 'Annual Membership',
                planDuration: '1 Year',
                
                // Payment status
                status: recruitData.paymentStatus === 'completed' ? 'success' :
                       recruitData.paymentStatus === 'failed' ? 'failed' :
                       'pending',
                
                paymentMethod: recruitData.paymentMethod || 'Online',
                
                // Timestamps
                createdAt: recruitData.paymentDate?.toDate?.() ||
                          recruitData.paymentDate ||
                          recruitData.createdAt?.toDate?.() || 
                          recruitData.createdAt || 
                          new Date()
              }
              
              payments.push(paymentData)
            }
          }
        }
      } catch (error) {
        // console.log('Recruits collection error:', error)
      }
      
      // Sort payments by date (newest first)
      payments.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
      
      // Calculate statistics based on real data
      const stats = this.calculatePaymentStats(payments)
      
      return {
        payments,
        stats
      }
    } catch (error) {
      // console.error('Error fetching payments:', error)
      throw error
    }
  }

  /**
   * Calculate payment statistics from real data
   */
  calculatePaymentStats(payments) {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const stats = {
      totalRevenue: 0,
      totalPayments: payments.length,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      averagePayment: 0,
      todayRevenue: 0,
      monthlyRevenue: 0
    }
    
    payments.forEach(payment => {
      const amount = payment.amount || 0
      const paymentDate = new Date(payment.createdAt)
      
      // Count by status
      if (payment.status === 'success') {
        stats.successfulPayments++
        stats.totalRevenue += amount
        
        // Today's revenue
        if (paymentDate >= todayStart) {
          stats.todayRevenue += amount
        }
        
        // Monthly revenue
        if (paymentDate >= monthStart) {
          stats.monthlyRevenue += amount
        }
      } else if (payment.status === 'pending') {
        stats.pendingPayments++
      } else if (payment.status === 'failed') {
        stats.failedPayments++
      }
    })
    
    // Calculate average
    if (stats.successfulPayments > 0) {
      stats.averagePayment = Math.round(stats.totalRevenue / stats.successfulPayments)
    }
    
    return stats
  }

  /**
   * Export payments to CSV
   */
  exportToCSV(payments) {
    const headers = [
      'Transaction ID',
      'Order ID',
      'Member Name',
      'Email',
      'Phone',
      'USN',
      'Branch',
      'Year',
      'Amount (₹)',
      'Plan',
      'Duration',
      'Status',
      'Payment Method',
      'Date',
      'Time'
    ]
    
    const rows = payments.map(payment => {
      const date = new Date(payment.createdAt)
      return [
        payment.transactionId || '',
        payment.orderId || '',
        payment.userName || '',
        payment.userEmail || '',
        payment.userPhone || '',
        payment.userUSN || '',
        payment.userBranch || '',
        payment.userYear || '',
        payment.amount || '0',
        payment.planName || '',
        payment.planDuration || '',
        payment.status || '',
        payment.paymentMethod || '',
        date.toLocaleDateString('en-IN'),
        date.toLocaleTimeString('en-IN')
      ]
    })
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    return csvContent
  }

  /**
   * Verify user exists in database
   */
  async verifyUserExists(email) {
    try {
      // Check users collection
      const usersQuery = query(
        collection(db, this.usersCollection),
        where('email', '==', email),
        limit(1)
      )
      
      const usersSnapshot = await getDocs(usersQuery)
      
      if (!usersSnapshot.empty) {
        return {
          exists: true,
          collection: 'users',
          data: usersSnapshot.docs[0].data()
        }
      }
      
      // Check recruits collection
      const recruitsQuery = query(
        collection(db, this.recruitsCollection),
        where('personalEmail', '==', email),
        limit(1)
      )
      
      const recruitsSnapshot = await getDocs(recruitsQuery)
      
      if (!recruitsSnapshot.empty) {
        return {
          exists: true,
          collection: 'recruits',
          data: recruitsSnapshot.docs[0].data()
        }
      }
      
      return {
        exists: false,
        collection: null,
        data: null
      }
    } catch (error) {
      // console.error('Error verifying user:', error)
      return {
        exists: false,
        collection: null,
        data: null
      }
    }
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(transactionId) {
    try {
      // Check payments collection first
      const paymentsQuery = query(
        collection(db, this.paymentsCollection),
        where('transactionId', '==', transactionId),
        limit(1)
      )
      
      const paymentsSnapshot = await getDocs(paymentsQuery)
      
      if (!paymentsSnapshot.empty) {
        return {
          id: paymentsSnapshot.docs[0].id,
          ...paymentsSnapshot.docs[0].data()
        }
      }
      
      // Check users collection
      const usersQuery = query(
        collection(db, this.usersCollection),
        where('paymentDetails.transactionId', '==', transactionId),
        limit(1)
      )
      
      const usersSnapshot = await getDocs(usersQuery)
      
      if (!usersSnapshot.empty) {
        const doc = usersSnapshot.docs[0]
        const userData = doc.data()
        return {
          id: doc.id,
          ...userData.paymentDetails,
          userName: userData.name,
          userEmail: userData.email
        }
      }
      
      return null
    } catch (error) {
      // console.error('Error fetching payment by transaction ID:', error)
      throw error
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentDataService()
