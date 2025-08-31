import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react"; // Removed Ticket icon from import
import { Link } from "react-router-dom";
import { getEventTypeColor, formatEventDate } from "../../utils/eventUtils";

const EventCard = ({ event, onOpenModal }) => {
  const isActionable =
    event.status === "upcoming" || event.status === "ongoing";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="h-full glass-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${getEventTypeColor(
              event.type
            )}`}
          >
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </div>
          {event.status === "upcoming" && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
              Upcoming
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{event.participantCount || 0} Participants</span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            {isActionable ? (
              <Link
                to={`/events/${event.id}/register`}
                className="w-full text-center block btn-primary text-sm"
              >
                Register Now
              </Link>
            ) : (
              // --- THIS IS THE UPDATED BUTTON WITHOUT THE ICON ---
              <button
                onClick={() => onOpenModal(event)}
                className="w-full text-center block btn-primary text-sm"
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;