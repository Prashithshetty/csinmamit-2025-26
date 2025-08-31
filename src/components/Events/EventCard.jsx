import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Share2 } from "lucide-react"; // 1. Import the Share2 icon
import { getEventTypeColor, formatEventDate } from "../../utils/eventUtils";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'; // 2. Import toast for notifications

const EventCard = ({ event, index }) => {

  // 3. New function to handle the share button click
  const handleShare = (e) => {
    // These two lines are important to stop the browser from doing anything else
    e.preventDefault(); 
    e.stopPropagation();

    const eventUrl = `${window.location.origin}/events/${event.id}`;
    
    // Use the modern Navigator API to copy to clipboard
    navigator.clipboard.writeText(eventUrl).then(() => {
      // Show a success message using the toast library already in your project
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
      className="group -mt-10"
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
            {/* Meta info remains the same */}
            <div className="flex items-center gap-2"><Calendar size={16} /><span>{formatEventDate(event.date)}</span></div>
            <div className="flex items-center gap-2"><Clock size={16} /><span>{event.time}</span></div>
            <div className="flex items-center gap-2"><MapPin size={16} /><span>{event.location}</span></div>
            <div className="flex items-center gap-2"><Users size={16} /><span>{event.participants} Participants</span></div>
          </div>
          
          {/* Action Buttons Container */}
          <div className="mt-auto pt-4"> 
            {/* 4. This link now goes to the registration page again */}
            <Link
              to="/event-registration"
              className="w-full text-center block btn-primary text-sm"
            >
              {event.status === "upcoming" ? "Register Now" : "View Details"}
            </Link>

            {/* 5. Our new mobile-friendly share button */}
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