import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Users,
  MapPin,
  Maximize2
} from 'lucide-react'

const Highlights = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const highlights = [
    {
      id: 1,
      image: '/highlights/event (1).jpg',
      title: 'Tech Symposium 2024',
      date: 'March 15, 2024',
      participants: '200+',
      location: 'NMAMIT Auditorium'
    },
    {
      id: 2,
      image: '/highlights/event (2).jpg',
      title: 'Hackathon 2024',
      date: 'February 20, 2024',
      participants: '150+',
      location: 'Computer Lab'
    },
    {
      id: 3,
      image: '/highlights/event (3).jpg',
      title: 'AI Workshop',
      date: 'January 10, 2024',
      participants: '100+',
      location: 'Seminar Hall'
    },
    {
      id: 4,
      image: '/highlights/event (4).jpg',
      title: 'Web Dev Bootcamp',
      date: 'December 5, 2023',
      participants: '80+',
      location: 'Lab Complex'
    },
    {
      id: 5,
      image: '/highlights/event (5).jpg',
      title: 'Cloud Computing Seminar',
      date: 'November 15, 2023',
      participants: '120+',
      location: 'Conference Room'
    },
    {
      id: 6,
      image: '/highlights/event (6).jpg',
      title: 'Cybersecurity Workshop',
      date: 'October 20, 2023',
      participants: '90+',
      location: 'IT Block'
    },
    {
      id: 7,
      image: '/highlights/event (7).jpg',
      title: 'Data Science Summit',
      date: 'September 10, 2023',
      participants: '180+',
      location: 'Main Auditorium'
    },
    {
      id: 8,
      image: '/highlights/event (8).jpg',
      title: 'IoT Exhibition',
      date: 'August 25, 2023',
      participants: '150+',
      location: 'Exhibition Hall'
    },
    {
      id: 9,
      image: '/highlights/event (9).jpg',
      title: 'Blockchain Conference',
      date: 'July 15, 2023',
      participants: '100+',
      location: 'Seminar Hall'
    }
  ]

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setSelectedImage(highlights[index])
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? highlights.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setSelectedImage(highlights[newIndex])
  }

  const goToNext = () => {
    const newIndex = currentIndex === highlights.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setSelectedImage(highlights[newIndex])
  }

  return (
    <section className="section-padding relative" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 mb-4">
            Event <span className="gradient-text">Highlights</span>
          </h2>
          <p className="body-text max-w-3xl mx-auto">
            Glimpses of our successful events, workshops, and activities that showcase 
            the vibrant tech community at CSI NMAMIT.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-xl glass-card">
                <div className="aspect-w-16 aspect-h-12 relative h-64">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {item.participants}
                      </span>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-12 right-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>

                {/* Navigation Buttons */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>

                {/* Image */}
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                />

                {/* Image Info */}
                <div className="mt-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white">
                  <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <Calendar size={16} />
                      {selectedImage.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users size={16} />
                      {selectedImage.participants} Participants
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      {selectedImage.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Highlights
