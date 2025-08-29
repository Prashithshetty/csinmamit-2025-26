import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  Settings,
  Bell,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const location = useLocation();
  const { user, signInWithGoogle, logout, authLoading, getUserRoleDisplay, isUserCoreMember } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);

  // Enhanced debug logging
  useEffect(() => {
    if (user) {
      console.log('🔍 === Navbar Debug Info ===');
      console.log('👤 User:', user);
      console.log('📧 User Email:', user.email);
      console.log('🎭 User Role:', user.role);
      console.log('⭐ Is Core Member (function):', isUserCoreMember());
      console.log('🏷️ Role Display:', getUserRoleDisplay());
      console.log('🔗 Profile Link Should Be:', isUserCoreMember() ? "/core-profile" : "/profile");
      console.log('========================');
    } else {
      console.log('❌ No user in navbar');
    }
  }, [user, isUserCoreMember, getUserRoleDisplay]);

  // Enhanced scroll detection with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileDropdown(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Touch handlers for mobile gestures
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && isOpen) {
      setIsOpen(false);
    } else if (isRightSwipe && !isOpen) {
      setIsOpen(true);
    }
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/events", label: "Events", icon: Calendar },
    { path: "/team", label: "Team", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    initial: { 
      opacity: 0, 
      x: "100%",
      transition: { duration: 0.2 }
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: "100%",
      transition: { duration: 0.2 }
    }
  };

  const mobileItemVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-card shadow-xl backdrop-blur-xl border-b border-cyber-blue/30"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="relative">
                  <img
                    src="/csi-logo.png"
                    alt="CSI Logo"
                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyber-blue/50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold gradient-text-animated">
                    CSI NMAMIT
                  </h1>
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-none">
                    Computer Society of India
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-3 xl:px-4 py-2 flex items-center space-x-2 transition-all duration-300 rounded-lg group ${
                    isActive(path)
                      ? "text-cyber-blue dark:text-cyber-pink font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-cyber-blue dark:hover:text-cyber-pink"
                  }`}
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{label}</span>
                  {isActive(path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full shadow-lg shadow-cyber-blue/50"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-purple/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}

              {/* Enhanced Join CSI Button */}
              <Link
                to="/recruit"
                className="ml-2 xl:ml-4 px-4 xl:px-6 py-2 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/40 hover:from-cyber-blue/20 hover:to-cyber-purple/20 hover:shadow-lg hover:shadow-cyber-blue/30 transition-all duration-300 flex items-center space-x-2 group relative overflow-hidden"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Join CSI</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-purple/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Link>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 xl:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative group"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={20} className="text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={20} className="text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Auth/Profile Section */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 xl:space-x-3 px-3 xl:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt={user.name}
                        className={`h-8 w-8 xl:h-9 xl:w-9 rounded-full border-2 ${
                          isUserCoreMember() 
                            ? 'border-yellow-500 group-hover:border-yellow-400' 
                            : 'border-cyber-blue group-hover:border-cyber-purple'
                        } transition-colors duration-300`}
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm xl:text-base max-w-[100px] xl:max-w-[120px] truncate">
                        {user.name?.split(" ")[0]}
                      </span>
                      {isUserCoreMember() && (
                        <span className="text-xs text-yellow-500 dark:text-yellow-400 font-medium">
                          {getUserRoleDisplay()}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`${profileDropdown ? "rotate-180" : ""} transition-transform duration-300`}
                    />
                  </motion.button>

                  {/* Enhanced Dropdown */}
                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-xl overflow-hidden border border-cyber-blue/30"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          {isUserCoreMember() && (
                            <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <Sparkles size={12} className="mr-1" />
                              {getUserRoleDisplay()}
                            </div>
                          )}
                        </div>
                        
                        <Link
                          to={isUserCoreMember() ? "/core-profile" : "/profile"}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => {
                            console.log('🔗 Profile link clicked, navigating to:', isUserCoreMember() ? "/core-profile" : "/profile");
                            setProfileDropdown(false);
                          }}
                        >
                          <User size={18} className="text-gray-600 dark:text-gray-400" />
                          <span>My Profile</span>
                        </Link>
                        
                        {isUserCoreMember() && (
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setProfileDropdown(false)}
                          >
                            <Settings size={18} className="text-gray-600 dark:text-gray-400" />
                            <span>Core Dashboard</span>
                          </Link>
                        )}
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setProfileDropdown(false)}
                        >
                          <Settings size={18} className="text-gray-600 dark:text-gray-400" />
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                          >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={signInWithGoogle}
                  disabled={authLoading}
                  className="btn-primary flex items-center space-x-2 px-4 xl:px-6 py-2 xl:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogIn size={18} />
                  <span>{authLoading ? "Signing in..." : "Sign In"}</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Right Actions */}
            <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
              {/* Mobile Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-yellow-500" />
                ) : (
                  <Moon size={18} className="text-gray-700" />
                )}
              </motion.button>

              {/* Mobile User Avatar (if logged in) */}
              {user && (
                <div className="flex items-center">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.name}
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 ${
                      isUserCoreMember() ? 'border-yellow-500' : 'border-cyber-blue'
                    }`}
                  />
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative z-10"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} className="sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} className="sm:w-6 sm:h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-72 sm:w-80 glass-card border-l border-cyber-blue/30 z-50 lg:hidden overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Mobile Menu Header */}
              <motion.div 
                variants={mobileItemVariants}
                className="flex items-center justify-between pt-12"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="/csi-logo.png"
                    alt="CSI Logo"
                    className="h-10 w-10"
                  />
                  <div>
                    <h2 className="text-lg font-bold gradient-text-animated">CSI NMAMIT</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Computer Society of India</p>
                  </div>
                </div>
              </motion.div>

              {/* User Info Section */}
              {user && (
                <motion.div 
                  variants={mobileItemVariants}
                  className={`flex items-center space-x-3 p-4 rounded-lg border ${
                    isUserCoreMember()
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                      : 'bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border-cyber-blue/20'
                  }`}
                >
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.name}
                    className={`h-12 w-12 rounded-full border-2 ${
                      isUserCoreMember() ? 'border-yellow-500' : 'border-cyber-blue'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                    {isUserCoreMember() && (
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Sparkles size={10} className="mr-1" />
                        {getUserRoleDisplay()}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <motion.div variants={mobileItemVariants} className="space-y-2">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(path)
                        ? "bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 text-cyber-blue dark:text-cyber-pink border border-cyber-blue/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="font-medium">{label}</span>
                    {isActive(path) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 bg-cyber-blue rounded-full"
                      />
                    )}
                  </Link>
                ))}
              </motion.div>

              {/* Join CSI Button */}
              <motion.div variants={mobileItemVariants}>
                <Link
                  to="/recruit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-3 w-full px-4 py-4 rounded-lg bg-gradient-to-r from-cyber-blue/15 to-cyber-purple/15 border border-cyber-blue/40 hover:from-cyber-blue/25 hover:to-cyber-purple/25 transition-all duration-300"
                >
                  <Sparkles size={20} />
                  <span className="font-medium">Join CSI</span>
                </Link>
              </motion.div>

              {/* Auth Section */}
              <motion.div variants={mobileItemVariants} className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to={isUserCoreMember() ? "/core-profile" : "/profile"}
                      onClick={() => {
                        console.log('📱 Mobile profile link clicked, navigating to:', isUserCoreMember() ? "/core-profile" : "/profile");
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User size={20} />
                      <span>My Profile</span>
                    </Link>
                    {isUserCoreMember() && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Settings size={20} />
                        <span>Core Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings size={20} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setIsOpen(false);
                    }}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-lg hover:shadow-lg hover:shadow-cyber-blue/30 transition-all duration-300 disabled:opacity-50"
                  >
                    <LogIn size={20} />
                    <span>{authLoading ? "Signing in..." : "Sign In with Google"}</span>
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;