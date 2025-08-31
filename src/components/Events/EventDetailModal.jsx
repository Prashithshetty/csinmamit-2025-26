import { motion, AnimatePresence } from "framer-motion";
import { X, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEventDate } from "../../utils/eventUtils";

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  const description = event.brief || event.description;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-lg"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative w-full max-w-4xl h-auto md:h-[80vh] rounded-2xl overflow-hidden bg-black/70 border border-white/20 shadow-2xl flex flex-col md:flex-row"
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

          {/* Left Side: Poster */}
          <div className="w-full md:w-1/2 relative h-64 md:h-full">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-3xl font-bold text-white drop-shadow-md">
                {event.title}
              </h3>
              <p className="text-primary-300 font-medium">
                {formatEventDate(event.date)}
              </p>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 flex flex-col text-gray-300">
            {/* Mobile Heading */}
            <div className="md:hidden text-center mb-4">
              <h3 className="text-2xl font-bold text-white">{event.title}</h3>
              <p className="text-primary-300">{formatEventDate(event.date)}</p>
            </div>

            {/* About Section */}
            <div className="flex-grow">
              <p className="text-lg font-semibold mb-2 text-primary-200">
                About the Event
              </p>
              <p className="text-sm leading-relaxed">{description}</p>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-6">
              <Link
                to="/event-registration"
                state={{ event: event }} // This line passes the event data
                className="w-full text-center mt-4 btn-primary text-base inline-flex items-center justify-center gap-2"
              >
                <Ticket size={20} />
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetailModal;
