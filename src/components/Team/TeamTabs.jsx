import { Users, GraduationCap } from 'lucide-react'

const TeamTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'students', label: 'Student Team', icon: Users },
    { id: 'faculty', label: 'Faculty', icon: GraduationCap },
  ]

  return (
    <section className="relative z-20 -mt-8">
      <div className="container-custom">
        <div className="flex justify-center">
          <div className="relative inline-flex bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full shadow-xl p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamTabs
