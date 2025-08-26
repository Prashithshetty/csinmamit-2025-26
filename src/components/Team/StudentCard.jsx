import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Linkedin, Github, Star } from 'lucide-react'

const StudentCard = ({ member, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick(member)}
      className="cursor-pointer"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        className="h-full"
      >
        <div className="h-full glass-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
          {/* Profile Image with Overlay */}
          <div className="relative h-48">
            <img
              src={member.imageSrc}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* Name and Role Overlay */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm opacity-90">{member.role}</p>
            </div>
            
            {/* President Badge */}
            {member.role === 'President' && (
              <Star className="absolute top-4 right-4 text-yellow-400 fill-yellow-400" size={20} />
            )}
          </div>
          
          {/* Member Details */}
          <div className="p-4">
            {/* Branch and Year */}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span>{member.branch}</span>
              <span>{member.year}</span>
            </div>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {member.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center gap-3">
              <a
                href={member.linkedin}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <Linkedin size={18} />
              </a>
              <a
                href={member.github}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={`${member.name}'s GitHub`}
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

export default StudentCard