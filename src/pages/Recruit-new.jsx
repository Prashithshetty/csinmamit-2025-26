import { useAuth } from '../contexts/AuthContext'
import RecruitHero from '../components/Recruit/RecruitHero'
import BenefitsSection from '../components/Recruit/BenefitsSection'
import MembershipPlans from '../components/Recruit/MembershipPlans'
import RegistrationForm from '../components/Recruit/RegistrationForm'
import { useRecruit } from '../hooks/useRecruit'

const Recruit = () => {
  const { user } = useAuth()

  const {
    formData,
    loading,
    selectedPlan,
    setSelectedPlan,
    handleInputChange,
    handleSubmit,
    signInWithGoogle,
    isProfileIncomplete
  } = useRecruit()

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Section */}
      <RecruitHero />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Membership Plans */}
      <MembershipPlans
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />

      {/* Registration Form */}
      <RegistrationForm
        user={user}
        formData={formData}
        loading={loading}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onSignIn={signInWithGoogle}
        isProfileIncomplete={isProfileIncomplete}
      />
    </div>
  )
}

export default Recruit
