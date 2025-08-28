import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  Activity,
  Home,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminLayout = () => {
  const { adminUser, logoutAdmin, sessionExpiry, updateSessionTimeout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionTimeLeft, setSessionTimeLeft] = useState('')

  // Navigation items - Django style grouping
  const navGroups = [
    {
      title: 'AUTHENTICATION AND AUTHORIZATION',
      items: [
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/groups', label: 'Groups', icon: UserCog },
      ]
    },
    {
      title: 'CONTENT MANAGEMENT',
      items: [
        { path: '/admin/events', label: 'Events', icon: Calendar },
        { path: '/admin/members', label: 'Members', icon: UserCog },
        { path: '/admin/payments', label: 'Payments', icon: CreditCard },
        { path: '/admin/content', label: 'Content', icon: FileText },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/messages', label: 'Messages', icon: Mail },
      ]
    }
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

  // Get breadcrumb from path
  const getBreadcrumb = () => {
    const path = location.pathname.split('/').filter(Boolean)
    return path.map((item, index) => ({
      label: item.charAt(0).toUpperCase() + item.slice(1),
      path: '/' + path.slice(0, index + 1).join('/')
    }))
  }

  return (
    <div className="django-admin min-h-screen bg-white flex flex-col">
      {/* Django-style Header */}
      <header className="bg-[#417690] text-white">
        {/* Top bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#2b5468]">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-normal">CSI NMAMIT administration</h1>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Welcome, <strong>{adminUser?.name}</strong></span>
            {sessionExpiry && (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="opacity-80">Session ends in:</span>
                <span className="px-2 py-0.5 bg-[#79aec8] text-white rounded text-xs">{sessionTimeLeft}</span>
              </div>
            )}
            <a href="/" className="hover:underline">View site</a>
            <button onClick={() => navigate('/admin/settings')} className="hover:underline">
              Change password
            </button>
            <button onClick={handleLogout} className="hover:underline">
              Log out
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-4 py-2 text-sm flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-2">
            <NavLink to="/admin/dashboard" className="hover:underline text-white hover:text-gray-300">
            <p className='cursor-pointer text-white hover:underline hover:text-gray-400'>Home</p></NavLink>
            {getBreadcrumb().slice(1).map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4" />
                <h6 to={crumb.path} className="cursor-pointer hover:underline text-white hover:text-gray-300">
                  {crumb.label}
                </h6>
              </div>
            ))}
          </div>
          {/* Session controls */}
          <div className="flex items-center gap-2">
            <label className="text-xs opacity-80">Extend session:</label>
            <button
              onClick={() => updateSessionTimeout(30 * 60 * 1000)}
              className="px-2 py-1 text-xs border border-[#ddd] rounded hover:bg-[#f5f5f5]"
            >
              +30m
            </button>
            <button
              onClick={() => updateSessionTimeout(60 * 60 * 1000)}
              className="px-2 py-1 text-xs border border-[#ddd] rounded hover:bg-[#f5f5f5]"
            >
              +1h
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Django-style Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-[#f8f8f8] border-r border-[#ddd] overflow-y-auto`}>
          <nav className="p-4">
            {/* Dashboard Link */}
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block px-3 py-2 mb-4 rounded text-sm ${
                  isActive
                    ? 'bg-[#79aec8] text-white font-semibold'
                    : 'text-[#417690] hover:bg-[#e5e5e5]'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </NavLink>

            {/* Navigation Groups */}
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded text-sm ${
                          isActive
                            ? 'bg-[#79aec8] text-white font-semibold'
                            : 'text-[#417690] hover:bg-[#e5e5e5]'
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}

            {/* Recent Actions */}
            <div className="mt-8 pt-4 border-t border-[#ddd]">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                Recent Actions
              </h3>
              <div className="space-y-1 text-sm">
                <button onClick={() => navigate('/admin/users?modal=add')}
                  className="w-full text-left block px-3 py-1 text-[#417690] hover:bg-[#e5e5e5] rounded">
                  + Add User
                </button>
                <button onClick={() => navigate('/admin/events?modal=add')}
                  className="w-full text-left block px-3 py-1 text-[#417690] hover:bg-[#e5e5e5] rounded">
                  + Add Event
                </button>
                <button onClick={() => navigate('/admin/members?modal=add')}
                  className="w-full text-left block px-3 py-1 text-[#417690] hover:bg-[#e5e5e5] rounded">
                  + Add Member
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
