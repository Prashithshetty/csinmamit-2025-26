import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck,
  Clock,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from '../../config/firebase'

const AdminDashboard = () => {
  const { adminUser, logAdminActivity } = useAdminAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMembers: 0,
    totalEvents: 0,
    totalRevenue: 0,
    userGrowth: 0,
    memberGrowth: 0,
    eventGrowth: 0,
    revenueGrowth: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenue: [],
    events: []
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      
      // Fetch users
      const usersQuery = query(collection(db, 'users'))
      const usersSnapshot = await getDocs(usersQuery)
      const totalUsers = usersSnapshot.size
      
      // Fetch active members
      const membersQuery = query(
        collection(db, 'users'),
        where('membership.status', '==', 'active')
      )
      const membersSnapshot = await getDocs(membersQuery)
      const activeMembers = membersSnapshot.size
      
      // Fetch events
      const eventsQuery = query(collection(db, 'events'))
      const eventsSnapshot = await getDocs(eventsQuery)
      const totalEvents = eventsSnapshot.size
      
      const totalRevenue = activeMembers * 500 // Assuming ₹500 per membership
      
      const userGrowth = 12.5
      const memberGrowth = 8.3
      const eventGrowth = 15.7
      const revenueGrowth = 10.2
      
      setStats({
        totalUsers,
        activeMembers,
        totalEvents,
        totalRevenue,
        userGrowth,
        memberGrowth,
        eventGrowth,
        revenueGrowth
      })
      
      // Fetch recent activities
      const activitiesQuery = query(
        collection(db, 'adminActivity'),
        orderBy('timestamp', 'desc'),
        limit(10)
      )
      const activitiesSnapshot = await getDocs(activitiesQuery)
      const activities = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecentActivities(activities)
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      setChartData({
        userGrowth: months.map((month, index) => ({
          month,
          users: Math.floor(Math.random() * 50) + 20 + (index * 10)
        })),
        revenue: months.map((month, index) => ({
          month,
          amount: Math.floor(Math.random() * 20000) + 10000 + (index * 2000)
        })),
        events: months.map((month, index) => ({
          month,
          count: Math.floor(Math.random() * 10) + 5
        }))
      })
      
      // Log activity
      await logAdminActivity('dashboard_viewed', { timestamp: new Date() })
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Stat Card Component
  const StatCard = ({ title, value, change, icon: Icon, color, prefix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  // Activity Item Component
  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (action) => {
      switch (action) {
        case 'user_created': return <UserCheck className="w-4 h-4" />
        case 'event_created': return <Calendar className="w-4 h-4" />
        case 'payment_received': return <CreditCard className="w-4 h-4" />
        default: return <Activity className="w-4 h-4" />
      }
    }

    return (
      <div className="flex items-start space-x-3 py-3 border-b border-gray-700 last:border-0">
        <div className="p-2 bg-gray-700 rounded-lg">
          {getActivityIcon(activity.action)}
        </div>
        <div className="flex-1">
          <p className="text-white text-sm">{activity.action?.replace('_', ' ').toUpperCase()}</p>
          <p className="text-gray-400 text-xs mt-1">
            {activity.adminEmail} • {new Date(activity.timestamp?.seconds * 1000).toLocaleString()}
          </p>
        </div>
      </div>
    )
  }

  // Simple Chart Component
  const SimpleChart = ({ data, dataKey, color }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]))
    
    return (
      <div className="flex items-end space-x-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full rounded-t transition-all hover:opacity-80"
              style={{
                height: `${(item[dataKey] / maxValue) * 100}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
            />
            <span className="text-xs text-gray-500 mt-2">{item.month.slice(0, 3)}</span>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {adminUser?.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.userGrowth}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Active Members"
          value={stats.activeMembers}
          change={stats.memberGrowth}
          icon={UserCheck}
          color="bg-green-600"
        />
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          change={stats.eventGrowth}
          icon={Calendar}
          color="bg-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueGrowth}
          icon={DollarSign}
          color="bg-yellow-600"
          prefix="₹"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">User Growth</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <SimpleChart data={chartData.userGrowth} dataKey="users" color="#3B82F6" />
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <SimpleChart data={chartData.revenue} dataKey="amount" color="#10B981" />
        </motion.div>

        {/* Events Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Events Created</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <SimpleChart data={chartData.events} dataKey="count" color="#8B5CF6" />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-1">
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activities</p>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          Create New Event
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-medium hover:from-green-700 hover:to-green-800 transition-all"
        >
          Add New Member
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
        >
          Send Announcement
        </motion.button>
      </div>
    </div>
  )
}

export default AdminDashboard
