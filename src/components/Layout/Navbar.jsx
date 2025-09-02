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
  ChevronRight,
  Shield,
  Zap,
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
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home, description: "Main dashboard" },
    { path: "/events", label: "Events", icon: Calendar, description: "Upcoming activities" },
    { path: "/team", label: "Team", icon: Users, description: "Meet our members" },
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
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const mobileItemVariants = {
    initial: { opacity: 0, x: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: 30, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-card shadow-2xl backdrop-blur-xl border-b border-cyber-blue/20 bg-white/80 dark:bg-gray-900/80"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src="/csi-logo.png"
                    alt="CSI Logo"
                    className="h-10 w-10 lg:h-12 lg:w-12 transition-all duration-300 group-hover:drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/30 to-cyber-purple/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 blur-md" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold gradient-text-animated">
                    CSI NMAMIT
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-none">
                    Computer Society of India
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-2.5 flex items-center space-x-2 transition-all duration-300 rounded-xl group ${
                    isActive(path)
                      ? "text-cyber-blue dark:text-cyber-pink font-semibold bg-cyber-blue/5 dark:bg-cyber-pink/5"
                      : "text-gray-700 dark:text-gray-300 hover:text-cyber-blue dark:hover:text-cyber-pink hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{label}</span>
                  {isActive(path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}

              {/* Enhanced Join CSI Button */}
              <Link
                to="/recruit"
                className="ml-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 hover:from-cyber-blue/20 hover:to-cyber-purple/20 hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 flex items-center space-x-2 group relative overflow-hidden"
              >
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Join CSI</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Link>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative group overflow-hidden"
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
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group border border-transparent hover:border-cyber-blue/20"
                  >
                    <div className="relative">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt={user.name}
                        className={`h-9 w-9 rounded-full border-2 ${
                          isUserCoreMember() 
                            ? 'border-yellow-500 shadow-lg shadow-yellow-500/25' 
                            : 'border-cyber-blue shadow-lg shadow-cyber-blue/25'
                        } transition-all duration-300`}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm max-w-[120px] truncate">
                        {user.name?.split(" ")[0]}
                      </span>
                      {isUserCoreMember() && (
                        <span className="text-xs text-yellow-500 dark:text-yellow-400 font-medium flex items-center">
                          <Shield size={10} className="mr-1" />
                          {getUserRoleDisplay()}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`${profileDropdown ? "rotate-180" : ""} transition-transform duration-300 text-gray-500`}
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
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 backdrop-blur-xl"
                      >
                        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.photoURL || "/default-avatar.png"}
                              alt={user.name}
                              className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-600 shadow-md"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                              {isUserCoreMember() && (
                                <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400">
                                  <Sparkles size={10} className="mr-1" />
                                  {getUserRoleDisplay()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to={isUserCoreMember() ? "/core-profile" : "/profile"}
                            className="flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            onClick={() => {
                              // console.log('🔗 Profile link clicked, navigating to:', isUserCoreMember() ? "/core-profile" : "/profile");
                              setProfileDropdown(false);
                            }}
                          >
                            <User size={18} className="text-gray-500 group-hover:text-cyber-blue transition-colors" />
                            <span className="group-hover:text-cyber-blue transition-colors">My Profile</span>
                            <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:text-cyber-blue transition-colors" />
                          </Link>
                          
                          {/* <Link
                            to="/settings"
                            className="flex items-center space-x-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                            onClick={() => setProfileDropdown(false)}
                          >
                            <Settings size={18} className="text-gray-500 group-hover:text-cyber-blue transition-colors" />
                            <span className="group-hover:text-cyber-blue transition-colors">Settings</span>
                            <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:text-cyber-blue transition-colors" />
                          </Link> */}
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors group"
                          >
                            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
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
                  className="btn-primary flex items-center space-x-2 px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium"
                >
                  <LogIn size={18} />
                  <span>{authLoading ? "Signing in..." : "Sign In"}</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Right Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Notifications */}
              {user && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <Bell size={18} className="text-gray-600 dark:text-gray-400" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-900"></div>
                </motion.button>
              )}

              {/* Mobile Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-yellow-500" />
                ) : (
                  <Moon size={18} className="text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>

              {/* Mobile User Avatar (if logged in) */}
              {user && (
                <div className="flex items-center">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.name}
                    className={`h-8 w-8 rounded-full border-2 ${
                      isUserCoreMember() ? 'border-yellow-500' : 'border-cyber-blue'
                    } shadow-md`}
                  />
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative z-10 ml-2"
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
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Simple Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden overflow-y-auto shadow-xl border-l border-gray-200 dark:border-gray-700"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="p-6 space-y-6">
              {/* Mobile Menu Header */}
              <motion.div 
                variants={mobileItemVariants}
                className="flex items-center justify-between pt-10"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="/csi-logo.png"
                    alt="CSI Logo"
                    className="h-8 w-8"
                  />
                  <div>
                    <h2 className="text-base font-bold gradient-text-animated">CSI NMAMIT</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Computer Society of India</p>
                  </div>
                </div>
              </motion.div>

              {/* User Info (if logged in) */}
              {user && (
                <motion.div 
                  variants={mobileItemVariants}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.name}
                    className={`h-10 w-10 rounded-full border-2 ${
                      isUserCoreMember() ? 'border-yellow-500' : 'border-cyber-blue'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                    {isUserCoreMember() && (
                      <span className="text-xs text-yellow-500 dark:text-yellow-400 font-medium">
                        {getUserRoleDisplay()}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <motion.div variants={mobileItemVariants} className="space-y-1">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(path)
                        ? "bg-cyber-blue/10 text-cyber-blue dark:text-cyber-pink"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </motion.div>

              {/* Join CSI Button */}
              <motion.div variants={mobileItemVariants}>
                <Link
                  to="/recruit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 hover:from-cyber-blue/20 hover:to-cyber-purple/20 transition-all duration-200"
                >
                  <Sparkles size={18} />
                  <span className="font-medium">Join CSI</span>
                </Link>
              </motion.div>

              {/* User Actions */}
              {user && (
                <motion.div variants={mobileItemVariants} className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to={isUserCoreMember() ? "/core-profile" : "/profile"}
                    onClick={() => {
                      // console.log('📱 Mobile profile link clicked, navigating to:', isUserCoreMember() ? "/core-profile" : "/profile");
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User size={20} />
                    <span>My Profile</span>
                  </Link>
                  {/* <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link> */}
                </motion.div>
              )}

              {/* Auth Section */}
              <motion.div variants={mobileItemVariants} className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
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
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setIsOpen(false);
                    }}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-lg hover:shadow-lg hover:shadow-cyber-blue/30 transition-all duration-300 disabled:opacity-50"
                  >
                    <LogIn size={20} />
                    <span>{authLoading ? "Signing in..." : "Sign In"}</span>
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