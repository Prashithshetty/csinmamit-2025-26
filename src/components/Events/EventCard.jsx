import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Share2 } from "lucide-react"; // Added Share2 icon
import { Link } from "react-router-dom";
import { getEventTypeColor, formatEventDate } from "../../utils/eventUtils";
import { toast } from "react-hot-toast";

const EventCard = ({ event, onOpenModal }) => {
  // A boolean to determine if the event is still open for registration.
  const isActionable =
    event.status === "upcoming" || event.status === "ongoing";

  // --- SHARE FUNCTION LOGIC ---
  const handleShare = async (eventToShare) => {
    // Construct a shareable URL for the event.
    const eventUrl = `${window.location.origin}/events/${eventToShare.id}`;
    const shareData = {
      title: eventToShare.title,
      text: `Check out this event from CSI-NMAMIT: ${eventToShare.title}`,
      url: eventUrl,
    };

    // Use the modern Web Share API if available (on mobile).
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // This can happen if the user closes the share dialog.
        console.error("Share error:", err);
      }
    } else {
      // Fallback for desktop browsers: copy the link to the clipboard.
      try {
        await navigator.clipboard.writeText(eventUrl);
        toast.success("Event link copied to clipboard!");
      } catch (err) {
        toast.error("Could not copy link.");
      }
    }
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
              {/* Using event.participantCount for clarity. */}
              <span>{event.participantCount || 0} Participants</span>
            </div>
          </div>

          {/* --- RESOLVED ACTION BUTTONS CONTAINER --- */}
          <div className="mt-auto pt-4 flex items-center gap-2">
            {/* Main Action Button */}
            <div className="flex-grow">
              {isActionable ? (
                <Link
                  to={`/events/${event.id}/register`}
                  className="w-full text-center block btn-primary text-sm"
                >
                  Register Now
                </Link>
              ) : (
                <button
                  onClick={() => onOpenModal(event)}
                  className="w-full text-center block btn-primary text-sm"
                >
                  View Details
                </button>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={() => handleShare(event)}
              className="p-2.5 btn-secondary" // Adjusted padding for better size
              aria-label="Share event"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
