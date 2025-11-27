import { motion } from 'framer-motion'
import { Info, CreditCard, Shield, Loader } from 'lucide-react'
import { membershipPlans } from '../../data/membershipData'

const RegistrationForm = ({
  user,
  formData,
  loading,
  selectedPlan,
  setSelectedPlan,
  onInputChange,
  onSubmit,
  onSignIn,
  isProfileIncomplete
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
          isProfileIncomplete ? (
            <div className="text-center py-8">
              <Info className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Profile Incomplete</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Please complete your profile details before joining CSI.
              </p>
              <a
                href="/profile"
                className="btn-primary inline-flex items-center gap-2"
              >
                Go to Profile
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-8 border border-blue-100 dark:border-blue-800">
                {/* <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Confirm Your Details
                </h3>
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Full Name</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Email</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Phone</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">USN</span>
                    <span className="font-medium">{formData.usn}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Branch</span>
                    <span className="font-medium">{formData.branch}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">Year</span>
                    <span className="font-medium">{formData.year}</span>
                  </div>
                </div> */}

                {/* Plan Selection */}
                <div className="mt-6 pt-6 border-t border-blue-100 dark:border-blue-800">
                  <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                    Select Membership Duration
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {membershipPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`cursor-pointer rounded-lg p-3 border transition-all relative ${selectedPlan === plan.id
                          ? 'bg-blue-100 border-blue-500 ring-1 ring-blue-500 dark:bg-blue-900/40'
                          : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{plan.duration}</span>
                          {selectedPlan === plan.id && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ₹{plan.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500 italic">
                  * To change these details, please update your profile.
                </div>
              </div>

              {/* Why Join */}
              <div className="mb-6">
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
          )
        )}
      </motion.div>
    </section>
  )
}

export default RegistrationForm
