import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Users, Lightbulb, Compass } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext' // make sure the path is correct

const NotFound = () => {
  const { isDark } = useTheme()

  const inspirationalQuotes = [
    { text: "Every error is a step towards innovation", author: "CSI Philosophy" },
    { text: "The best debugging happens when you explore new paths", author: "Unknown Developer" },
    { text: "404: An opportunity to discover something better", author: "Tech Wisdom" }
  ]

  const pathSuggestions = [
    { label: 'Home', path: '/', icon: Home, description: 'Start fresh' },
    { label: 'Events', path: '/events', icon: Lightbulb, description: 'Learn & grow' },
    { label: 'Team', path: '/team', icon: Users, description: 'Meet innovators' },
    { label: 'Join CSI', path: '/recruit', icon: Compass, description: 'Begin journey' },
  ]

  const handleNavigation = (path) => {
    console.log('Navigate to:', path)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  // Dynamic colors based on theme
  const bgOverlay = isDark ? 'bg-black/60 backdrop-blur-lg' : 'bg-white/20 backdrop-blur-md'
  const cardBg = isDark ? 'from-black/20 to-black/30' : 'from-white/20 to-white/30'
  const textMain = isDark ? 'text-cyber-black' : 'text-primary-blue'
  const gradient404 = isDark 
    ? 'from-primary-white via-cyber-pink to-cyber-white' 
    : 'from-cyber-white via-cyber-pink to-cyber-blue'

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Blurred, theme-aware background */}
      <div className={`absolute inset-0 ${bgOverlay} z-0`}></div>

      <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-4xl">

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative inline-block mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-8xl md:text-9xl font-black leading-none mb-4"
              >
                <span className={`bg-gradient-to-r text-black  dark:text-cyan-50 ${gradient404} bg-clip-text text-transparent`}>
                  404
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
              >
                <span className={`text-lg font-bold ${textMain} tracking-widest`}>
                  PATH TO DISCOVERY
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Where would you like to continue your journey?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {pathSuggestions.map(({ label, path, icon: Icon, description }, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavigation(path)}
                    className={`group w-full p-6 rounded-2xl bg-gradient-to-br ${cardBg} border border-gray-400/30 backdrop-blur-md hover:border-cyber-blue/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyber-blue/10 hover:-translate-y-1`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-primary-blue/20 group-hover:from-cyber-blue/30 group-hover:to-primary-blue/30 transition-all duration-300">
                        <Icon className="w-6 h-6 text-cyber-blue group-hover:text-cyber-pink transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-cyber-pink transition-colors">
                          {label}
                        </h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {description}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8"
          >
            <button
              onClick={handleGoBack}
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Footer inspiration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm">
              Remember: Every expert was once a beginner who never gave up.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
