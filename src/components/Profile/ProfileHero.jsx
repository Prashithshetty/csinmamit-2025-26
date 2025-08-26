import { motion } from 'framer-motion'

const ProfileHero = () => {
  return (
    <section className="relative py-10 overflow-hidden">
      <div className="absolute inset-0 animated-bg opacity-10" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="heading-2 mb-2">
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and membership
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ProfileHero
