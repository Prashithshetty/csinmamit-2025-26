import { Users, GraduationCap } from 'lucide-react'

const TeamTabs = ({ activeTab, setActiveTab }) => {
  return (
    <section className="sticky top-16 z-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="container-custom">
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'students'
                  ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Users className="inline-block mr-2" size={20} />
              Student Team
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'faculty'
                  ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <GraduationCap className="inline-block mr-2" size={20} />
              Faculty
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamTabs
