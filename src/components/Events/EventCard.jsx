import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

// Helper functions moved inside to prevent import errors
const getEventTypeColor = (type) => {
  switch (type) {
    case 'workshop':
      return 'from-blue-500 to-blue-700';
    case 'bootcamp':
      return 'from-green-500 to-green-700';
    case 'competition':
      return 'from-red-500 to-red-700';
    case 'seminar':
      return 'from-purple-500 to-purple-700';
    default:
      return 'from-gray-500 to-gray-700';
  }
};

const formatEventDate = (timestamp) => {
  if (!timestamp) return 'Date not available';
  if (timestamp.toDate) { // Check if it's a Firestore Timestamp
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  // Fallback for regular date strings
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const EventCard = ({ event }) => {

  const handleShare = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    const eventUrl = `${window.location.origin}/events/${event.id}`;
    
    navigator.clipboard.writeText(eventUrl).then(() => {
      toast.success('Event link copied!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      toast.error('Could not copy link.');
    });
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
            <div className="flex items-center gap-2"><Calendar size={16} /><span>{formatEventDate(event.date)}</span></div>
            <div className="flex items-center gap-2"><Clock size={16} /><span>{event.time}</span></div>
            <div className="flex items-center gap-2"><MapPin size={16} /><span>{event.location}</span></div>
            <div className="flex items-center gap-2"><Users size={16} /><span>{event.participantCount || 0} Participants</span></div>
          </div>
          
          {/* Action Buttons Container */}
          <div className="mt-auto pt-4"> 
            {/* THIS IS THE CORRECTED LINK */}
            <Link
              to={`/events/${event.id}`}
              className="w-full text-center block btn-primary text-sm"
            >
              {event.status === "upcoming" ? "Register Now" : "View Details"}
            </Link>

            <button
              onClick={handleShare}
              className="w-full text-center flex items-center justify-center gap-2 mt-2 btn-secondary text-sm"
            >
              <Share2 size={14} />
              Share Event
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;

