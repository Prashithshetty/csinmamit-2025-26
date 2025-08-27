import { motion } from "framer-motion"

const ProfileHero = () => {
  return (
    <section className="relative py-12 overflow-hidden dark:from-gray-900 dark:to-gray-800">
      {/* Optional background overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            My <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account and membership
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ProfileHero
