import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Mail, Linkedin } from 'lucide-react'

const FacultyCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        className="h-full"
      >
        <div className="h-full glass-card rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 group">
          {/* Profile Image */}
          <div className="relative mb-4">
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-primary-500/20 group-hover:border-primary-500 transition-colors"
            />
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-cyber-blue opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </div>
          
          {/* Member Info */}
          <h3 className="text-lg font-bold mb-1">{member.name}</h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
            {member.role}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {member.department}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {member.description}
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center gap-3">
            <a
              href={`mailto:${member.email}`}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`Email ${member.name}`}
            >
              <Mail size={18} />
            </a>
            <a
              href={member.linkedin}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={`${member.name}'s LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

export default FacultyCard
