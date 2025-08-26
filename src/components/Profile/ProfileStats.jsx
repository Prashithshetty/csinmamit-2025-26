import { Trophy, FileText, Award } from 'lucide-react'

const ProfileStats = () => {
  const stats = [
    { icon: Trophy, value: 5, label: 'Events', color: 'text-yellow-500' },
    { icon: FileText, value: 3, label: 'Certificates', color: 'text-blue-500' },
    { icon: Award, value: 2, label: 'Awards', color: 'text-purple-500' }
  ]

  return (
    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
      {stats.map((stat) => (
        <div key={stat.label}>
          <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
          <div className="text-xl font-bold">{stat.value}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default ProfileStats
