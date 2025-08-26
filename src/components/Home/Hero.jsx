import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code, Users, Trophy, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Hero = () => {
  const { user, signInWithGoogle, authLoading } = useAuth()

  const floatingIcons = [
    { Icon: Code, delay: 0, x: -200, y: -100 },
    { Icon: Users, delay: 0.2, x: 200, y: -150 },
    { Icon: Trophy, delay: 0.4, x: -250, y: 100 },
    { Icon: Zap, delay: 0.6, x: 250, y: 50 },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animated-bg opacity-10" />
      
      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 dark:opacity-10" />
      
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            x: [0, x, 0],
            y: [0, y, 0]
          }}
          transition={{
            duration: 20,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute hidden lg:block"
          style={{ left: '50%', top: '50%' }}
        >
          <Icon size={40} className="text-primary-500/20" />
        </motion.div>
      ))}

      <div className="container-custom relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <Sparkles size={16} className="text-cyber-blue" />
            <span className="text-sm font-medium">CSI NMAMIT is now public!</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white">
              NEW
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-1 mb-6"
          >
            {user ? (
              <>
                Welcome back,{' '}
                <span className="gradient-text-animated">{user.name}</span>
              </>
            ) : (
              <>
                Welcome to{' '}
                <span className="gradient-text-animated">CSI NMAMIT</span>
              </>
            )}
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-4"
          >
            <TypeAnimation
              sequence={[
                'Computer Society of India',
                2000,
                'Where Innovation Meets Technology',
                2000,
                'Building Tomorrow\'s Tech Leaders',
                2000,
                'Join the Tech Revolution',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="body-text max-w-2xl mx-auto mb-10"
          >
            Embark on a transformative journey with the premier technology society at NMAMIT. 
            Explore cutting-edge workshops, hackathons, and networking opportunities that shape the future of tech.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {user ? (
              <>
                <Link to="/events" className="btn-primary group">
                  <span>Explore Events</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/profile" className="btn-cyber">
                  <span>View Profile</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={signInWithGoogle}
                  disabled={authLoading}
                  className="btn-primary group"
                >
                  <span>{authLoading ? 'Signing in...' : 'Get Started'}</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link to="/events" className="btn-cyber">
                  <span>Explore Events</span>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { label: 'Active Members', value: '500+', icon: Users },
              { label: 'Events Conducted', value: '50+', icon: Trophy },
              { label: 'Workshops', value: '30+', icon: Code },
              { label: 'Years of Excellence', value: '10+', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-4 rounded-xl"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
    </section>
  )
}

export default Hero
