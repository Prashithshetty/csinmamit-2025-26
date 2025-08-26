import { motion } from 'framer-motion'
import StudentCard from './StudentCard'

const StudentGrid = ({ students, onMemberClick }) => {
  return (
    <motion.div
      key="students"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
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
  )
}

export default StudentGrid
