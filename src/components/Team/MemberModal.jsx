import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MemberModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 top-10 z-50 flex items-center justify-center backdrop-blur-lg"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden bg-black/70 border border-white/20 shadow-2xl flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white/90 hover:text-white" />
          </button>

          {/* Left Side - Image */}
          <div className="w-1/2 relative hidden md:block">
            <img
              src={member.imageSrc}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-3xl font-bold text-white drop-shadow-md">
                {member.name}
              </h3>
              <p className="text-primary-300 font-medium">{member.role}</p>
            </div>
          </div>

          {/* Right Side - Info */}
          <div className="w-full md:w-1/2 h-full overflow-y-auto p-6 space-y-6">
            {/* Mobile Heading (only visible on small screens) */}
            <div className="md:hidden text-center mb-4">
              <h3 className="text-2xl font-bold text-white">{member.name}</h3>
              <p className="text-primary-300">{member.role}</p>
            </div>

            {/* About */}
            <div className="text-gray-300">
              <p className="text-lg font-semibold mb-2 text-primary-200">
                About
              </p>
              <p className="text-sm leading-relaxed">
                {member.branch} • {member.year}
              </p>
            </div>

            {/* Skills */}
            <div>
              <p className="text-lg font-semibold mb-3 text-primary-200">
                Skills
              </p>
              <div className="flex flex-wrap gap-3">
                {member.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 12px rgba(59,130,246,0.6)",
                    }}
                    className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-primary-500/20 to-cyber-blue/20 text-primary-100 border border-white/10 shadow-sm cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemberModal;
