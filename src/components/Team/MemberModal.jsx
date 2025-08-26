import { motion, AnimatePresence } from 'framer-motion'

const MemberModal = ({ member, onClose }) => {
  if (!member) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-md w-full glass-card rounded-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <span className="text-2xl">×</span>
          </button>
          
          {/* Member Details */}
          <div className="text-center">
            {/* Profile Image */}
            <img
              src={member.imageSrc}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            
            {/* Name and Role */}
            <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
              {member.role}
            </p>
            
            {/* Additional Info */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{member.branch} • {member.year}</p>
            </div>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {member.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-500/10 to-cyber-blue/10 text-primary-700 dark:text-primary-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MemberModal
