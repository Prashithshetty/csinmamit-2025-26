import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { 
  CreditCard, 
  Lock, 
  Search, 
  Download, 
  RefreshCw,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Eye,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import OTPModal from './components/OTPModal'
import PaymentDetailsModal from './components/PaymentDetailsModal'
import { paymentService } from './services/paymentDataService'

export default function AdminPayments() {
  const navigate = useNavigate()
  const { adminUser, logAdminActivity } = useAdminAuth()
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(true)
  
  // Payment data states
  const [payments, setPayments] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0
  })
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  
  // Modal states
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Check if admin is already authenticated for payments
  useEffect(() => {
    const paymentAuth = sessionStorage.getItem('paymentPageAuth')
    if (paymentAuth) {
      const authData = JSON.parse(paymentAuth)
      if (authData.expiry > Date.now()) {
        setIsAuthenticated(true)
        setShowOTPModal(false)
      } else {
        sessionStorage.removeItem('paymentPageAuth')
      }
    }
  }, [])

  // Fetch payment data after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchPaymentData()
    }
  }, [isAuthenticated])

  // Apply filters when search or filter changes
  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterStatus, dateRange, payments])

  // Fetch payment data from Firestore
  const fetchPaymentData = async () => {
    setLoading(true)
    try {
      const data = await paymentService.fetchAllPayments()
      setPayments(data.payments)
      setStats(data.stats)
      
      // Log admin activity
      await logAdminActivity('payments_viewed', {
        timestamp: new Date(),
        totalPayments: data.payments.length
      })
      
      toast.success('Payment data loaded successfully')
    } catch (error) {
      // console.error('Error fetching payments:', error)
      toast.error('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters to payment data
  const applyFilters = () => {
    let filtered = [...payments]
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus)
    }
    
    // Date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start).getTime()
      const endDate = new Date(dateRange.end).getTime()
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.createdAt).getTime()
        return paymentDate >= startDate && paymentDate <= endDate
      })
    }
    
    setFilteredPayments(filtered)
  }

  // Handle OTP verification success
  const handleOTPSuccess = () => {
    setIsAuthenticated(true)
    setShowOTPModal(false)
    
    // Store authentication in session storage (expires in 30 minutes)
    const authData = {
      authenticated: true,
      expiry: Date.now() + (30 * 60 * 1000),
      adminEmail: adminUser?.email
    }
    sessionStorage.setItem('paymentPageAuth', JSON.stringify(authData))
    
    toast.success('Authentication successful! Access granted to payment data.')
  }

  // Handle OTP modal close
  const handleOTPCancel = () => {
    setShowOTPModal(false)
    navigate('/admin')
    toast.error('Authentication required to access payment data')
  }

  // Export payment data
  const exportPaymentData = () => {
    try {
      const csvData = paymentService.exportToCSV(filteredPayments)
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      
      toast.success('Payment data exported successfully')
      logAdminActivity('payments_exported', {
        timestamp: new Date(),
        recordCount: filteredPayments.length
      })
    } catch (error) {
      // console.error('Error exporting data:', error)
      toast.error('Failed to export payment data')
    }
  }

  // View payment details
  const viewPaymentDetails = (payment) => {
    setSelectedPayment(payment)
    setShowDetailsModal(true)
  }

  // Refresh payment data
  const refreshData = () => {
    fetchPaymentData()
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500 inline mr-1" />
      case 'failed':
        return <span className="w-4 h-4 text-red-500 inline mr-1">✗</span>
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 inline mr-1" />
      default:
        return null
    }
  }

  // If not authenticated, show OTP modal
  if (!isAuthenticated && showOTPModal) {
    return (
      <OTPModal
        isOpen={showOTPModal}
        onClose={handleOTPCancel}
        onSuccess={handleOTPSuccess}
        adminEmail="csidatabasenmamit@gmail.com"
      />
    )
  }

  // Main payment page content - Django Admin Style
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-[#417690]" />
          <h1 className="text-2xl font-normal text-[#333]">Payment Management</h1>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            Secured
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2 text-[#417690] hover:text-[#205067] hover:bg-gray-100 rounded transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportPaymentData}
            className="flex items-center px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067] transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards - Compact Django Style */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#ddd] rounded">
          <div className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-[#417690] mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-[#333]">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
        
        <div className="bg-white border border-[#ddd] rounded">
          <div className="p-4 text-center">
            <CreditCard className="w-6 h-6 text-[#417690] mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Total Payments</p>
            <p className="text-xl font-bold text-[#333]">{stats.totalPayments}</p>
          </div>
        </div>
        
        <div className="bg-white border border-[#ddd] rounded">
          <div className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Successful</p>
            <p className="text-xl font-bold text-[#333]">{stats.successfulPayments}</p>
            <p className="text-xs text-green-600">
              {stats.totalPayments > 0 ? Math.round((stats.successfulPayments / stats.totalPayments) * 100) : 0}%
            </p>
          </div>
        </div>
        
        <div className="bg-white border border-[#ddd] rounded">
          <div className="p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-xl font-bold text-[#333]">{stats.pendingPayments}</p>
          </div>
        </div>
      </div>

      {/* Filters Section - Django Style */}
      <div className="bg-white border border-[#ddd] rounded mb-4">
        <div className="bg-[#f5f5f5] px-4 py-2 border-b border-[#ddd]">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#79aec8]"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#79aec8]"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-2 py-1.5 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#79aec8]"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-2 py-1.5 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#79aec8]"
              />
            </div>

            {/* Clear Filters */}
            {(searchTerm || filterStatus !== 'all' || dateRange.start || dateRange.end) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                  setDateRange({ start: '', end: '' })
                }}
                className="px-3 py-1.5 text-sm text-[#ba2121] hover:text-[#8a1919] hover:bg-gray-100 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="px-4 py-2 text-xs text-gray-600">
          Showing {filteredPayments.length} of {payments.length} payments
        </div>
      </div>

      {/* Payment Table - Django Style */}
      <div className="bg-white border border-[#ddd] rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f8f8] border-b border-[#ddd]">
            <tr>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Transaction</th>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Member</th>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Amount</th>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Plan</th>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Status</th>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Date</th>
              <th className="text-left px-4 py-2 font-normal text-[#666] uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  Loading payment data...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.slice(0, 20).map((payment, index) => (
                <tr key={payment.id || index} className={`border-b border-[#eee] hover:bg-[#f5f5f5] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">#</span>
                      <div>
                        <div className="text-[#417690] hover:text-[#205067] font-medium">
                          {payment.transactionId || 'N/A'}
                        </div>
                        {payment.orderId && (
                          <div className="text-xs text-gray-500">
                            No order ID
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-[#333]">{payment.userName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{payment.userEmail || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#333]">
                      ₹{(payment.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#333]">{payment.planName || '1-Year Executive Membership'}</div>
                    <div className="text-xs text-gray-500">{payment.planDuration || '1 Year'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                      payment.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getStatusIcon(payment.status)}
                      {payment.status === 'success' ? 'Success' : payment.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-[#666]">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="text-xs">{formatDate(payment.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => viewPaymentDetails(payment)}
                      className="inline-flex items-center text-[#417690] hover:text-[#205067]"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-xs">View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedPayment(null)
          }}
        />
      )}
    </div>
  )
}
