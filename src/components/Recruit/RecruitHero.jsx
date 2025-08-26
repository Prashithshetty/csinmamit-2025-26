import { motion } from 'framer-motion'

const RecruitHero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 animated-bg opacity-10" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="heading-1 mb-4">
            Join <span className="gradient-text-animated">CSI NMAMIT</span>
          </h1>
          <p className="body-text max-w-3xl mx-auto">
            Become a part of the most vibrant tech community at NMAMIT. 
            Unlock exclusive benefits and accelerate your tech journey.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default RecruitHero
