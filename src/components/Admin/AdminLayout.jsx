import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  Search,
  ChevronDown,
  UserCog,
  FileText,
  BarChart3,
  Mail,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLayout = () => {
  const { adminUser, logoutAdmin, sessionExpiry } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'New user registration', time: '5 min ago', unread: true },
    { id: 2, type: 'success', message: 'Payment received', time: '1 hour ago', unread: true },
    { id: 3, type: 'warning', message: 'Event deadline approaching', time: '2 hours ago', unread: false }
  ])
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [sessionTimeLeft, setSessionTimeLeft] = useState('')

  // Navigation items
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/members', label: 'Members', icon: UserCog },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/content', label: 'Content', icon: FileText },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/messages', label: 'Messages', icon: Mail },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ]

  // Calculate session time remaining
  useEffect(() => {
    if (sessionExpiry) {
      const interval = setInterval(() => {
        const now = Date.now()
        const timeLeft = sessionExpiry - now
        
        if (timeLeft <= 0) {
          setSessionTimeLeft('Session expired')
        } else {
          const minutes = Math.floor(timeLeft / 60000)
          const seconds = Math.floor((timeLeft % 60000) / 1000)
          setSessionTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
          
          // Show warning when 5 minutes left
          if (minutes === 5 && seconds === 0) {
            toast.error('Session expires in 5 minutes!')
          }
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [sessionExpiry])

  // Handle logout
  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?')
    if (confirmed) {
      await logoutAdmin()
      navigate('/admin/login')
    }
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      toast.success(`Searching for: ${searchQuery}`)
      setSearchQuery('')
    }
  }

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    )
  }

  // Get notification icon color
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-blue-500'
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Mobile backdrop */}
            {sidebarOpen && window.innerWidth < 1024 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:relative w-72 h-full bg-gray-800 border-r border-gray-700 z-50 lg:z-0 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                    <p className="text-xs text-gray-400">CSI NMAMIT</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`
                        }
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Session Timer */}
              <div className="p-4 border-t border-gray-700">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Session Time</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-mono">{sessionTimeLeft}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={adminUser?.photoURL || `https://ui-avatars.com/api/?name=${adminUser?.name}&background=3B82F6&color=fff`}
                    alt={adminUser?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{adminUser?.name}</p>
                    <p className="text-gray-400 text-xs">{adminUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Search */}
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 w-64"
                />
              </form>
            </div>

            <div className="flex items-center space-x-4">
              {/* Activity Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-gray-400 hidden sm:inline">System Active</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => markNotificationAsRead(notif.id)}
                              className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                                notif.unread ? 'bg-gray-700/30' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <AlertCircle className={`w-5 h-5 mt-0.5 ${getNotificationColor(notif.type)}`} />
                                <div className="flex-1">
                                  <p className="text-white text-sm">{notif.message}</p>
                                  <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                                </div>
                                {notif.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No notifications
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-700">
                        <button className="w-full text-center text-blue-500 hover:text-blue-400 text-sm font-medium">
                          View All Notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <img
                    src={adminUser?.photoURL || `https://ui-avatars.com/api/?name=${adminUser?.name}&background=3B82F6&color=fff`}
                    alt={adminUser?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <p className="text-white font-medium">{adminUser?.name}</p>
                        <p className="text-gray-400 text-sm">{adminUser?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/admin/settings')
                            setProfileDropdownOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
                        >
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
