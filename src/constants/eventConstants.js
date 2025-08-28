import { Zap, TrendingUp, Users, Award, Tag } from 'lucide-react'

// Event types configuration
export const EVENT_TYPES = [
  { value: 'all', label: 'All Events', icon: Zap },
  { value: 'workshop', label: 'Workshops', icon: TrendingUp },
  { value: 'seminar', label: 'Seminars', icon: Users },
  { value: 'competition', label: 'Competitions', icon: Award },
  { value: 'bootcamp', label: 'Bootcamps', icon: Tag }
]

// Event type color gradients
export const EVENT_TYPE_COLORS = {
  workshop: 'from-blue-500 to-cyan-500',
  seminar: 'from-purple-500 to-pink-500',
  competition: 'from-orange-500 to-red-500',
  bootcamp: 'from-green-500 to-teal-500',
  default: 'from-gray-500 to-gray-600'
}

// Available years for filtering
export const EVENT_YEARS = ['2025','2024', '2023', '2022', '2021', '2020', '2019']

// Event status configurations
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  ONGOING: 'ongoing',
  CANCELLED: 'cancelled'
}
