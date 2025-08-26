import { motion } from 'framer-motion'
import EventCard from './EventCard'

const EventsGrid = ({ events, loading }) => {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-96 rounded-xl" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return null
  }

  return (
    <motion.div 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </motion.div>
  )
}

export default EventsGrid
