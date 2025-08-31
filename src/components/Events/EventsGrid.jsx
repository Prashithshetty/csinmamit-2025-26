import { motion } from "framer-motion";
import EventCard from "./EventCard";

// Accept the onViewDetails prop here
const EventsGrid = ({ events, loading, onViewDetails }) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-96 rounded-xl" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          index={index}
          onViewDetails={onViewDetails} // Pass the prop down to the EventCard
        />
      ))}
    </motion.div>
  );
};

export default EventsGrid;
