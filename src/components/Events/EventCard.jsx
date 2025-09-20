import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Tag, Share2 } from "lucide-react";

const EventCard = ({ event, onRegister, onViewDetails }) => {
  if (!event) return null;

  const { title, date, location, type, bannerUrl, status } = event;

  const formattedDate = date?.toDate
    ? date.toDate().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "TBA";

  const formattedTime = date?.toDate
    ? date.toDate().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const showShareButton = ["upcoming", "ongoing", "completed", "past"].includes(
    status
  );

  const ActionComponent = () => {
    if (status === "upcoming") {
      return (
        <button
          onClick={() => onRegister(event)}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register Now
        </button>
      );
    } else if (status === "ongoing") {
      return (
        <div className="text-center bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg">
          Event is Live!
        </div>
      );
    } else if (status === "past" || status === "completed") {
      return (
        <button
          onClick={() => onViewDetails(event)}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Event
        </button>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image reveal effect */}
      <motion.div
        className="h-48 overflow-hidden relative"
        whileHover={{ scale: 1.1 }} // Image zooms in to reveal hidden parts
        transition={{ duration: 0.5 }}
      >
        <img
          src={bannerUrl || "/hero.jpg"}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
      </motion.div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
          {title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Tag size={16} className="text-blue-500" />
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
              {type}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
            <ActionComponent />

            {showShareButton && (
              <button
                aria-label="Share event"
                onClick={async () => {
                  const url = `${window.location.origin}/events/${encodeURIComponent(
                    event.id
                  )}/register`;
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: event.title,
                        text: `Check out ${event.title}`,
                        url,
                      });
                    } else if (navigator.clipboard?.writeText) {
                      await navigator.clipboard.writeText(url);
                    }
                  } catch (_) {}
                }}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Share2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
