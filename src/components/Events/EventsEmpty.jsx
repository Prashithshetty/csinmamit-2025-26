import { Calendar } from 'lucide-react'

const EventsEmpty = () => {
  return (
    <div className="text-center py-20">
      <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No events found</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Try adjusting your filters or search term
      </p>
    </div>
  )
}

export default EventsEmpty
