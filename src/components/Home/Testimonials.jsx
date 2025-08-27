import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Final Year, CSE",
      image: "/team25/anand-bobba.jpg",
      content:
        "CSI NMAMIT has been instrumental in shaping my technical skills. The workshops and hackathons provided real-world experience that helped me land my dream job.",
      rating: 5,
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Third Year, ISE",
      image: "/team25/ananya-s-nayak.jpg",
      content:
        "Being part of CSI opened doors to amazing networking opportunities. The mentorship and guidance from seniors have been invaluable in my journey.",
      rating: 5,
    },
    {
      id: 3,
      name: "Arjun Kumar",
      role: "Alumni, Software Engineer @ Google",
      image: "/team25/ashwin-arun.jpg",
      content:
        "The foundation I built at CSI NMAMIT continues to benefit me in my career. Problem-solving skills and teamwork experience are irreplaceable.",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      className="section-padding relative dark:bg-gray-900"
      ref={ref}
    >
      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-3">
            Voices of our <span className="gradient-text">Community</span>
          </h2>
          <p className="body-text max-w-2xl mx-auto">
            Honest words from members and alumni who grew with CSI NMAMIT.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -40 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 md:p-10 text-center"
            >
              <Quote className="w-10 h-10 text-blue-500 mx-auto mb-4 opacity-70" />

              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Profile */}
              <div className="flex flex-col items-center gap-3">
                {/* <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/70"
                /> */}
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>

                {/* Stars */}
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:-left-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 md:-right-14 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex
                    ? "w-6 h-2 bg-gradient-to-r from-blue-500 to-cyan-500"
                    : "w-2 h-2 bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
