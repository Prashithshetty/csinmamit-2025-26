import { motion } from 'framer-motion'
import { Info, CreditCard, Shield, Loader } from 'lucide-react'
import { membershipPlans } from '../../data/membershipData'

const RegistrationForm = ({
  user,
  formData,
  loading,
  selectedPlan,
  onInputChange,
  onSubmit,
  onSignIn
}) => {
  const selectedPlanData = membershipPlans.find(p => p.id === selectedPlan)

  return (
    <section className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto glass-card rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your <span className="gradient-text">Registration</span>
        </h2>

        {!user ? (
          <div className="text-center py-8">
            <Info className="w-16 h-16 mx-auto text-primary-500 mb-4" />
            <p className="mb-4">Please sign in to continue with registration</p>
            <button
              onClick={onSignIn}
              className="btn-primary"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  placeholder="10-digit number"
                  required
                  className="input-field"
                />
              </div>

              {/* USN */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  USN *
                </label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={onInputChange}
                  placeholder="4NM21CS000"
                  required
                  className="input-field"
                />
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Branch *
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={onInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Branch</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={onInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Year</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Final Year">Final Year</option>
                </select>
              </div>

              {/* Why Join */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Why do you want to join CSI? (Optional)
                </label>
                <textarea
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={onInputChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Tell us about your interests and what you hope to gain..."
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure payment via Razorpay</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{selectedPlanData?.price}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  )
}

export default RegistrationForm
