import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { membershipPlans } from '../../data/membershipData'

const MembershipPlans = ({ selectedPlan, setSelectedPlan }) => {
  return (
    <section className="container-custom mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Choose Your <span className="gradient-text">Membership Plan</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {membershipPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
              selectedPlan === plan.id
                ? 'glass-card ring-2 ring-primary-500 shadow-xl'
                : 'glass-card hover:shadow-lg'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-cyber-blue text-white text-xs font-medium">
                Most Popular
              </div>
            )}
            
            {/* Plan Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold gradient-text mb-1">
                ₹{plan.price}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.duration}</p>
            </div>

            {/* Features List */}
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Selected Indicator */}
            <div className={`mt-6 text-center ${
              selectedPlan === plan.id ? 'block' : 'hidden'
            }`}>
              <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default MembershipPlans
