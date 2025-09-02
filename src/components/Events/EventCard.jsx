import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { getEventTypeColor, formatEventDate } from "../../utils/eventUtils";

const EventCard = ({ event, index }) => {
  const handleRegister = () => {
    // Handle registration logic
    // console.log('Register for event:', event.id)
  };

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
            {event.type}
          </div>

          {event.category && event.category !== "PREVIOUS" && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
              {event.category}
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
            {event.description}
          </p>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mt-auto">
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
              <span>{event.location || "Online"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{event.participants || 0} Participants</span>
            </div>
          </div>

          {/* This will now render either a button or a link based on the event's category */}
          {ActionComponent}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
