import React from 'react'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  Hash, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Printer,
  Share2,
  DollarSign,
  Info,
  Building,
  GraduationCap,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentDetailsModal({ payment, isOpen, onClose }) {
  if (!isOpen || !payment) return null

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handlePrint = () => {
    window.print()
    toast.success('Opening print dialog...')
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF receipt
    const receiptData = `
PAYMENT RECEIPT
=====================================
Transaction ID: ${payment.transactionId || 'N/A'}
Order ID: ${payment.orderId || 'N/A'}
Date: ${formatDate(payment.createdAt)}

Member Details:
Name: ${payment.userName || 'N/A'}
Email: ${payment.userEmail || 'N/A'}
Phone: ${payment.userPhone || 'N/A'}
USN: ${payment.userUSN || 'N/A'}
Branch: ${payment.userBranch || 'N/A'}
Year: ${payment.userYear || 'N/A'}

Payment Details:
Amount: ₹${payment.amount || 0}
Plan: ${payment.planName || 'N/A'} - ${payment.planDuration || 'N/A'}
Status: ${payment.status || 'N/A'}
Payment Method: ${payment.paymentMethod || 'Razorpay'}

=====================================
CSI NMAMIT
Computer Society of India
NMAM Institute of Technology
    `.trim()

    const blob = new Blob([receiptData], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${payment.transactionId || 'payment'}.txt`
    a.click()
    
    toast.success('Receipt downloaded successfully')
  }

  const handleShare = () => {
    const shareText = `Payment Receipt - Transaction: ${payment.transactionId}, Amount: ₹${payment.amount}, Status: ${payment.status}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Payment Receipt',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Receipt details copied to clipboard')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Payment Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Status Banner */}
          <div className={`rounded-lg border p-4 mb-6 ${getStatusColor(payment.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(payment.status)}
                <div>
                  <p className="font-semibold text-lg capitalize">
                    Payment {payment.status}
                  </p>
                  <p className="text-sm opacity-75">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹{payment.amount || 0}</p>
                <p className="text-sm opacity-75">{payment.planName}</p>
              </div>
            </div>
          </div>

          {/* Transaction Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-gray-500" />
                Transaction Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.transactionId || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.orderId || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment ID:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.paymentId || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Method:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.paymentMethod || 'Razorpay'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{payment.amount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.planName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.planDuration || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Currency:</span>
                  <span className="text-sm font-medium text-gray-900">INR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Member Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              Member Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userName || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userEmail || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userPhone || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">USN:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userUSN || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Branch:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userBranch || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Year:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.userYear || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {payment.notes && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Additional Notes
              </h3>
              <p className="text-sm text-gray-700">{payment.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(payment.createdAt)}
                </span>
              </div>
              {payment.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(payment.updatedAt)}
                  </span>
                </div>
              )}
              {payment.completedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(payment.completedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadReceipt}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
