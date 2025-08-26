import { motion } from 'framer-motion'
import StudentCard from './StudentCard'

const StudentGrid = ({ students, onMemberClick }) => {
  return (
    <div className="w-full">
      {/* Desktop Grid */}
      <motion.div
        key="students-grid"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {students.map((member, index) => (
          <StudentCard 
            key={member.id} 
            member={member} 
            index={index} 
            onClick={onMemberClick}
          />
        ))}
      </motion.div>

      {/* Mobile Horizontal Scroll (fixed card size) */}
      <motion.div
        key="students-scroll"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory px-2 pb-4 scrollbar-hide"
      >
        {students.map((member, index) => (
          <div 
            key={member.id} 
            className="snap-start w-72 flex-shrink-0"
          >
            <StudentCard 
              member={member} 
              index={index} 
              onClick={onMemberClick}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default StudentGrid
