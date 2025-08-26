import { motion } from 'framer-motion'
import { Users, Calendar, Award, Zap } from 'lucide-react'
import { membershipBenefits } from '../../data/membershipData'

const iconMap = {
  Users,
  Calendar,
  Award,
  Zap
}

const BenefitsSection = () => {
  return (
    <section className="container-custom mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Why Join <span className="gradient-text">CSI?</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipBenefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon]
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary-500/20 to-cyber-blue/20 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default BenefitsSection
