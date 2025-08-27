import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { EVENT_TYPES, EVENT_YEARS } from '../../constants/eventConstants'

const EventsNavigator = ({ selectedYear, setSelectedYear, selectedType, setSelectedType }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <section className="py-16 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      <div className="container-custom max-w-6xl mx-auto px-6">
        
        {/* Year Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="-mt-28"
        >
          <div className="flex flex-wrap justify-center gap-3 p-4 rounded-2xl ">
            {EVENT_YEARS.map((year, index) => (
              <motion.button
                key={year}
                onClick={() => setSelectedYear(year)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative border-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                  selectedYear === year
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/25'
                    : 'bg-white/90 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                {selectedYear === year && (
                  <motion.div
                    layoutId="yearIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl"
                    style={{ zIndex: -1 }}
                  />
                )}
                <span className="relative z-10">
                  {year}-{(parseInt(year) + 1).toString().slice(2)}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Drawer Toggle Button */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <motion.button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-700"
          >
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {isDrawerOpen ? 'Hide' : 'Show'}
            </span>
            <motion.div
              animate={{ rotate: isDrawerOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} className="text-indigo-500" />
            </motion.div>
          </motion.button>
        </motion.div> */}

      </div>
    </section>
  )
}

export default EventsNavigator