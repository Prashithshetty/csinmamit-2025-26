import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Users, 
  User, 
  LogIn, 
  LogOut,
  Sun,
  Moon,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const location = useLocation()
  const { user, signInWithGoogle, logout, authLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/team', label: 'Team', icon: Users },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-card shadow-lg backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* ✅ Logo + Text always visible */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <img 
                src="/csi-logo.png" 
                alt="CSI Logo" 
                className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <div className="block">
              <h1 className="text-base sm:text-lg md:text-xl font-bold gradient-text-animated">
                CSI NMAMIT
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-none">
                Computer Society of India
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                  isActive(path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
                {isActive(path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-cyber-blue"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Join CSI Button */}
            <Link
              to="/recruit"
              className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 text-cyber-blue hover:border-cyber-purple/50 hover:text-cyber-purple transition-all duration-300 flex items-center space-x-2"
            >
              <Sparkles size={18} />
              <span className="font-medium">Join CSI</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>

            {/* Auth Button / Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border-2 border-primary-500"
                  />
                  <span className="font-medium text-sm">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${profileDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-xl overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setProfileDropdown(false)
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={authLoading}
                className="btn-primary flex items-center space-x-2"
              >
                <LogIn size={18} />
                <span>{authLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-gray-200 dark:border-gray-700"
          >
            <div className="container-custom py-4 space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(path)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}

              <Link
                to="/recruit"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30"
              >
                <Sparkles size={20} />
                <span className="font-medium">Join CSI</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle()
                    setIsOpen(false)
                  }}
                  disabled={authLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <LogIn size={20} />
                  <span>{authLoading ? 'Signing in...' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
