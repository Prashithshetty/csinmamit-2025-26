import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  LogIn,
  Sun,
  Moon,
  Sparkle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const MobileNavbar = () => {
  const location = useLocation();
  const { user, signInWithGoogle, authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Mobile bottom navigation links
  const mobileNavLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/team", label: "Team", icon: Users },
    { path: "/events", label: "Events", icon: Calendar },
    { path: "/recruit", label: "Join CSI", icon: Sparkles },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Top Navigation (Minimal) */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/csi-logo.png"
                alt="CSI Logo"
                className="h-8 w-8"
              />
              <span className="text-sm font-bold gradient-text-animated">CSI NMAMIT</span>
            </Link>

            {/* Mobile Right Actions */}
            <div className="flex items-center space-x-2">
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
                    className="h-12 w-12 rounded-full border-2 border-cyber-blue shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="px-4 pb-4 pt-2">
          <div className="relative">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl" />
            
            {/* Navigation Items */}
            <div className="relative flex items-center justify-around px-2 py-3">
              {mobileNavLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 group relative ${
                    isActive(path)
                      ? "text-cyber-blue dark:text-cyber-pink"
                      : "text-gray-600 dark:text-gray-400 hover:text-cyber-blue dark:hover:text-cyber-pink"
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive(path) && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <div className="relative z-10">
                    <Icon 
                      size={20} 
                      className={`transition-all duration-300 ${
                        isActive(path) 
                          ? "scale-110 drop-shadow-lg" 
                          : "group-hover:scale-105"
                      }`}
                    />
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium relative z-10 ${
                    isActive(path) ? "font-semibold" : ""
                  }`}>
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Login Button (Mobile) */}
      {!user && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="fixed bottom-20 right-4 z-50 lg:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={signInWithGoogle}
            disabled={authLoading}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-full shadow-2xl shadow-cyber-blue/30 hover:shadow-cyber-blue/50 transition-all duration-300 disabled:opacity-50"
          >
            <LogIn size={18} />
            <span className="font-medium text-sm">{authLoading ? "..." : "Login"}</span>
          </motion.button>
        </motion.div>
      )}
    </>
  );
};

export default MobileNavbar;
