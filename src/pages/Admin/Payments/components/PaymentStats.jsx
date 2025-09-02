import React from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  CreditCard
} from 'lucide-react'

export default function PaymentStats({ stats, loading }) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Payments',
      value: stats.totalPayments.toLocaleString('en-IN'),
      icon: CreditCard,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Successful',
      value: stats.successfulPayments.toLocaleString('en-IN'),
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      percentage: stats.totalPayments > 0 
        ? `${((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1)}%`
        : '0%'
    },
    {
      title: 'Pending',
      value: stats.pendingPayments.toLocaleString('en-IN'),
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Failed',
      value: stats.failedPayments.toLocaleString('en-IN'),
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Average Payment',
      value: `₹${stats.averagePayment.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString('en-IN')}`,
      icon: Calendar,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`,
      icon: Users,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ]

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-5 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-14 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-5 bg-gray-200 rounded mb-2"></div>
              <div className="w-28 h-7 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Only show the first 4 most important stats
  const mainStats = statCards.slice(0, 4)

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 sm:p-2.5 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                </div>
                {stat.percentage && (
                  <span className={`text-xs sm:text-sm font-medium ${stat.textColor}`}>
                    {stat.percentage}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
