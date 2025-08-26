import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Final Year, Computer Science',
      image: '/team25/anand-bobba.jpg',
      content: 'CSI NMAMIT has been instrumental in shaping my technical skills. The workshops and hackathons provided real-world experience that helped me land my dream job.',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Third Year, Information Science',
      image: '/team25/ananya-s-nayak.jpg',
      content: 'Being part of CSI opened doors to amazing networking opportunities. The mentorship and guidance from seniors have been invaluable in my growth journey.',
      rating: 5
    },
    {
      id: 3,
      name: 'Arjun Kumar',
      role: 'Alumni, Software Engineer at Google',
      image: '/team25/ashwin-arun.jpg',
      content: 'The foundation I built at CSI NMAMIT continues to benefit me in my professional career. The problem-solving skills and teamwork experience are irreplaceable.',
      rating: 5
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'Second Year, Electronics',
      image: '/team25/harshitha-p-salian.jpg',
      content: 'CSI events are not just about technology; they teach leadership, communication, and collaboration. It\'s a complete package for personal development.',
      rating: 5
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Final Year, Mechanical',
      image: '/team25/nithin-k-r.jpg',
      content: 'Even as a non-CS student, CSI welcomed me with open arms. The interdisciplinary approach helped me integrate technology into my field effectively.',
      rating: 5
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section className="section-padding relative bg-gray-50 dark:bg-gray-900/50" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 mb-4">
            What Our Members <span className="gradient-text">Say</span>
          </h2>
          <p className="body-text max-w-3xl mx-auto">
            Hear from our community members about their experiences and journey with CSI NMAMIT.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-cyber-blue flex items-center justify-center">
            <Quote className="w-8 h-8 text-white" />
          </div>

          {/* Testimonial Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-8 md:p-12"
            >
              <div className="text-center">
                {/* Avatar */}
                <div className="mb-6 relative inline-block">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-cyber-blue opacity-20 blur-xl" />
                </div>

                {/* Rating */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Author */}
                <div>
                  <h4 className="text-lg font-bold gradient-text">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-lg glass-card hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg glass-card hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-gradient-to-r from-primary-500 to-cyber-blue rounded-full'
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary-500/10 to-cyber-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 rounded-full blur-3xl" />
      </div>
    </section>
  )
}

export default Testimonials
