import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, MapPin } from "lucide-react";

const EventDetailModal = ({ isOpen, onClose, event, onRegister }) => {
  if (!isOpen || !event) return null;

  const formattedDate = event.date?.toDate
    ? event.date.toDate().toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Date to be announced";

  // // --- SHARE LOGIC ---
  // // This function handles the sharing of the event link.
  // const handleShare = async () => {
  //   // Share a stable URL that exists in the app to avoid 404s.
  //   const eventUrl = `${window.location.origin}/events`;

  //   // Use the Web Share API if the browser supports it
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: event.title,
  //         text: `Check out this event: ${event.title}`,
  //         url: eventUrl,
  //       });
  //       toast.success("Event shared successfully!");
  //     } catch (error) {
  //       // This can happen if the user cancels the share action
  //       // console.error('Error sharing:', error);
  //     }
  //   } else {
  //     // Fallback for browsers that do not support the Web Share API
  //     try {
  //       await navigator.clipboard.writeText(eventUrl);
  //       toast.success("Event link copied to clipboard!");
  //     } catch (err) {
  //       toast.error("Failed to copy link.");
  //     }
  //   }
  // };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col"
        >
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
              {event.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  Date & Time
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {formattedDate}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  Location
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {event.location}
                </p>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p>{event.description}</p>
            </div>
          </div>

          <div className="p-4 mt-auto border-t dark:border-gray-700 flex-shrink-0 flex gap-4 items-center">
            <button
              onClick={() => onRegister(event)}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventDetailModal;
