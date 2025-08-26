import { motion } from 'framer-motion'

const TeamHero = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-90" />
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-300" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Meet Our{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                Team
              </span>
              {/* Underline Glow */}
              <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 blur-md opacity-70" />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            The passionate individuals behind <span className="font-semibold text-indigo-300">CSI NMAMIT</span>  
            who work tirelessly to create meaningful experiences and opportunities for our community.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default TeamHero
