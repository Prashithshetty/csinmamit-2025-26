import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TeamHero from '../components/Team/TeamHero'
import TeamTabs from '../components/Team/TeamTabs'
import FacultyGrid from '../components/Team/FacultyGrid'
import StudentGrid from '../components/Team/StudentGrid'
import MemberModal from '../components/Team/MemberModal'
import { facultyData, studentTeamData } from '../data/teamData.json'

const Team = () => {
  const [activeTab, setActiveTab] = useState('students')
  const [selectedMember, setSelectedMember] = useState(null)

  console.log(studentTeamData, facultyData ,"data check here !!")

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <TeamHero />

      {/* Tab Navigation */}
      <TeamTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Team Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            {activeTab === 'faculty' ? (
              <FacultyGrid faculty={facultyData} />
            ) : (
              <StudentGrid 
                students={studentTeamData} 
                onMemberClick={setSelectedMember}
              />
            )}
          </AnimatePresence>
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
