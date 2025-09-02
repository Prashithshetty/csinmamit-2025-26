import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Linkedin, Github, Star } from 'lucide-react'

const StudentCard = ({ member, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onClick(member)}
      className="cursor-pointer"
    >
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.01}>
        <div className="relative rounded-xl overflow-hidden shadow-md group bg-black">
          
          {/* Full Image */}
          <img
            src={member.imageSrc}
            alt={member.name}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Bottom Gradient with Name + USN + Role */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/100 via-black/80 to-transparent">
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            {member.usn && (
              <p className="text-xs text-gray-400 uppercase tracking-wider">{member.usn}</p>
            )}
            <p className="text-sm text-yellow-400 font-medium mt-1">{member.role}</p>
          </div>

          {/* President Badge */}
          {member.role === 'President' && (
            <div className="absolute top-4 right-4 bg-yellow-400 p-2 rounded-full shadow-md">
              <Star className="text-white fill-white" size={18} />
            </div>
          )}

          {/* Hover Overlay (Fade In) */}
          <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-5">
            
            {/* Name and USN in hover */}
            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
            {member.usn && (
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{member.usn}</p>
            )}
            <p className="text-sm text-yellow-400 font-medium mb-3">{member.role}</p>
            
            {/* Branch + Year */}
            {(member.branch || member.year) && (
              <div className="text-sm text-gray-300 mb-3">
                {member.branch && <span>{member.branch}</span>}
                {member.branch && member.year && <span> • </span>}
                {member.year && <span>{member.year}</span>}
              </div>
            )}

            {/* Socials */}
            <div className="flex gap-4">
              {member.linkedin && member.linkedin !== '#' && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-white/10 hover:bg-indigo-500/30 transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={20} className="text-white" />
                </a>
              )}
              {member.github && member.github !== '#' && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-white/10 hover:bg-purple-500/30 transition-colors"
                  title="GitHub Profile"
                >
                  <Github size={20} className="text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

export default StudentCard
