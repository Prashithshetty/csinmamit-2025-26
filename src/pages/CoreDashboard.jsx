import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { PERMISSIONS, ROLE_CATEGORIES } from '../constants/coreMembers'
import {
  Users,
  Calendar,
  FileText,
  Settings,
  TrendingUp,
  Award,
  Bell,
  Shield,
  Sparkles,
  ChevronRight,
  Activity,
  Target,
  Briefcase,
  MessageSquare,
  Image,
  Share2,
  Code,
  DollarSign
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CoreDashboard = () => {
  const { user, getUserRoleDisplay, checkPermission } = useAuth()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  // Define dashboard cards based on permissions
  const getDashboardCards = () => {
    const cards = []

    // Common cards for all core members
    cards.push({
      title: 'My Profile',
      description: 'View and edit your profile',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/profile',
      stats: null
    })

    // Permission-based cards
    if (checkPermission('events')) {
      cards.push({
        title: 'Events Management',
        description: 'Manage CSI events and workshops',
        icon: Calendar,
        color: 'from-purple-500 to-purple-600',
        link: '/events/manage',
        stats: '5 upcoming'
      })
    }

    if (checkPermission('members')) {
      cards.push({
        title: 'Member Directory',
        description: 'View and manage CSI members',
        icon: Users,
        color: 'from-green-500 to-green-600',
        link: '/members',
        stats: '500+ members'
      })
    }

    if (checkPermission('technical')) {
      cards.push({
        title: 'Technical Projects',
        description: 'Manage technical projects and resources',
        icon: Code,
        color: 'from-cyan-500 to-cyan-600',
        link: '/projects',
        stats: '12 active'
      })
    }

    if (checkPermission('graphics')) {
      cards.push({
        title: 'Design Assets',
        description: 'Access and manage design resources',
        icon: Image,
        color: 'from-pink-500 to-pink-600',
        link: '/designs',
        stats: '50+ designs'
      })
    }

    if (checkPermission('social_media')) {
      cards.push({
        title: 'Social Media',
        description: 'Manage social media content',
        icon: Share2,
        color: 'from-indigo-500 to-indigo-600',
        link: '/social',
        stats: '10 scheduled'
      })
    }

    if (checkPermission('publicity')) {
      cards.push({
        title: 'Publicity Campaigns',
        description: 'Manage publicity and marketing',
        icon: MessageSquare,
        color: 'from-orange-500 to-orange-600',
        link: '/publicity',
        stats: '3 active'
      })
    }

    if (checkPermission('finance')) {
      cards.push({
        title: 'Finance Dashboard',
        description: 'View financial reports and budgets',
        icon: DollarSign,
        color: 'from-emerald-500 to-emerald-600',
        link: '/finance',
        stats: 'Budget: ₹50k'
      })
    }

    if (checkPermission('announcements')) {
      cards.push({
        title: 'Announcements',
        description: 'Create and manage announcements',
        icon: Bell,
        color: 'from-red-500 to-red-600',
        link: '/announcements',
        stats: '2 pending'
      })
    }

    return cards
  }

  const dashboardCards = getDashboardCards()

  // Quick stats based on role
  const getQuickStats = () => {
    const rolePosition = user?.roleDetails?.position
    const stats = []

    if (rolePosition === 'President' || rolePosition === 'Vice President') {
      stats.push(
        { label: 'Total Members', value: '500+', icon: Users, trend: '+12%' },
        { label: 'Events This Month', value: '8', icon: Calendar, trend: '+25%' },
        { label: 'Active Projects', value: '15', icon: Briefcase, trend: '+5%' },
        { label: 'Engagement Rate', value: '85%', icon: Activity, trend: '+8%' }
      )
    } else if (rolePosition === 'Technical Lead' || rolePosition === 'Technical Team') {
      stats.push(
        { label: 'Active Projects', value: '12', icon: Code, trend: '+3' },
        { label: 'Pull Requests', value: '24', icon: Activity, trend: '+8' },
        { label: 'Issues Resolved', value: '45', icon: Target, trend: '+15' },
        { label: 'Team Members', value: '6', icon: Users, trend: '0' }
      )
    } else if (rolePosition === 'Event Management Lead' || rolePosition === 'Event Management') {
      stats.push(
        { label: 'Upcoming Events', value: '5', icon: Calendar, trend: '+2' },
        { label: 'Registrations', value: '320', icon: Users, trend: '+45' },
        { label: 'Workshops', value: '3', icon: Briefcase, trend: '+1' },
        { label: 'Satisfaction', value: '92%', icon: Award, trend: '+5%' }
      )
    } else {
      // Default stats for other roles
      stats.push(
        { label: 'Tasks Completed', value: '24', icon: Target, trend: '+6' },
        { label: 'Team Projects', value: '5', icon: Briefcase, trend: '+2' },
        { label: 'Contributions', value: '18', icon: Activity, trend: '+4' },
        { label: 'Recognition', value: '3', icon: Award, trend: '+1' }
      )
    }

    return stats
  }

  const quickStats = getQuickStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-20">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <div className="flex items-center space-x-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Shield size={16} className="mr-2" />
                  {getUserRoleDisplay()}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  CSI Core Member
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <Settings size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link to={card.link} className="block">
                <div className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${card.color} rounded-lg shadow-lg`}>
                      <card.icon size={24} className="text-white" />
                    </div>
                    {card.stats && (
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {card.stats}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {card.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-cyber-blue dark:text-cyber-pink group-hover:translate-x-1 transition-transform">
                    <span>Access</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link to="/activity" className="text-sm text-cyber-blue dark:text-cyber-pink hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { action: 'Event created', detail: 'Tech Talk: AI in 2024', time: '2 hours ago', icon: Calendar },
              { action: 'Member joined', detail: 'John Doe joined CSI', time: '5 hours ago', icon: Users },
              { action: 'Project updated', detail: 'Website redesign progress', time: '1 day ago', icon: Code },
              { action: 'Announcement posted', detail: 'Workshop registration open', time: '2 days ago', icon: Bell }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <activity.icon size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.detail}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role-specific message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your Permissions
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                As {getUserRoleDisplay()}, you have access to:
              </p>
              <div className="flex flex-wrap gap-2">
                {user?.roleDetails?.permissions?.map(permission => (
                  <span
                    key={permission}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {PERMISSIONS[permission] || permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CoreDashboard
