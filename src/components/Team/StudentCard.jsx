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
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Bottom Gradient with Name + Role */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/100 via-black/70 to-transparent">
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-gray-300">{member.role}</p>
          </div>

          {/* President Badge */}
          {member.role === 'President' && (
            <div className="absolute top-4 right-4 bg-yellow-400 p-2 rounded-full shadow-md">
              <Star className="text-white fill-white" size={18} />
            </div>
          )}

          {/* Hover Overlay (Fade In) */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-5">
            
            {/* Branch + Year */}
            <div className="text-sm text-gray-300 mb-3">
              <span>{member.branch}</span> • <span>{member.year}</span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {member.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-4">
              <a
                href={member.linkedin}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-white/10 hover:bg-indigo-500/30 transition-colors"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a
                href={member.github}
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-white/10 hover:bg-purple-500/30 transition-colors"
              >
                <Github size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

export default StudentCard
