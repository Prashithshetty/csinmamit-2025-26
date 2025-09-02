import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'
import TeamHero from '../components/Team/TeamHero'
import TeamTabs from '../components/Team/TeamTabs'
import FacultyGrid from '../components/Team/FacultyGrid'
import StudentGrid from '../components/Team/StudentGrid'
import MemberModal from '../components/Team/MemberModal'
import { fetchCoreMembers, fetchFacultyMembers } from '../services/teamService'
import toast from 'react-hot-toast'

const Team = () => {
  const [activeTab, setActiveTab] = useState('students')
  const [selectedMember, setSelectedMember] = useState(null)
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch team data from Firestore
  const fetchTeamData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch both faculty and student data in parallel
      const [facultyData, studentData] = await Promise.all([
        fetchFacultyMembers(),
        fetchCoreMembers()
      ])
      
      setFaculty(facultyData)
      setStudents(studentData)
      
      // Show info if some profiles are incomplete
      const incompleteProfiles = studentData.filter(
        member => !member.photoURL || member.photoURL === '/default-avatar.png'
      )
      
      if (incompleteProfiles.length > 0) {
        toast.info(
          `${incompleteProfiles.length} member${incompleteProfiles.length > 1 ? 's' : ''} haven't updated their profile yet`,
          { duration: 4000 }
        )
      }
    } catch (err) {
      console.log('Error fetching team data:', err.message)
      setError('Failed to load team data. Please try again.')
      toast.error('Failed to load team data')
      
      // Load fallback data from JSON
      try {
        const { facultyData, studentTeamData } = await import('../data/teamData.json')
        setFaculty(facultyData || [])
        setStudents(studentTeamData || [])
        toast.info('Showing cached team data', { duration: 3000 })
      } catch (fallbackError) {
        console.error('Failed to load fallback data:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchTeamData()
  }, [])

  // Refresh data
  const handleRefresh = () => {
    toast.promise(
      fetchTeamData(),
      {
        loading: 'Refreshing team data...',
        success: 'Team data refreshed!',
        error: 'Failed to refresh data'
      }
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <TeamHero />

      {/* Tab Navigation with Refresh Button */}
      <div className="relative">
        <TeamTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh team data"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Team Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            // Loading State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400">Loading team members...</p>
            </motion.div>
          ) : error ? (
            // Error State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            // Content
            <AnimatePresence mode="wait">
              {activeTab === 'faculty' ? (
                <FacultyGrid faculty={faculty} />
              ) : (
                <>
                  <StudentGrid 
                    students={students} 
                    onMemberClick={setSelectedMember}
                  />
                  
                  {/* Info Message for Profiles */}
                  {students.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 text-center"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Team members' profiles are automatically synced from their CSI accounts
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Member Modal */}
      {selectedMember && (
        <MemberModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  )
}

export default Team
