import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Code2, 
  Cpu, 
  Globe, 
  Shield, 
  Database, 
  Cloud,
  Smartphone,
  Brain,
  Palette
} from 'lucide-react'

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const technologies = [
    { icon: Code2, name: 'Web Development', color: 'text-blue-500' },
    { icon: Smartphone, name: 'Mobile Apps', color: 'text-green-500' },
    { icon: Brain, name: 'AI & ML', color: 'text-purple-500' },
    { icon: Shield, name: 'Cybersecurity', color: 'text-red-500' },
    { icon: Database, name: 'Data Science', color: 'text-yellow-500' },
    { icon: Cloud, name: 'Cloud Computing', color: 'text-cyan-500' },
    { icon: Cpu, name: 'IoT', color: 'text-orange-500' },
    { icon: Globe, name: 'Blockchain', color: 'text-indigo-500' },
    { icon: Palette, name: 'UI/UX Design', color: 'text-pink-500' },
  ]

  const activities = [
    {
      title: 'Technical Workshops',
      description: 'Hands-on learning with industry experts',
      count: '30+',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Hackathons',
      description: 'Competitive coding and innovation challenges',
      count: '10+',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Guest Lectures',
      description: 'Insights from tech leaders and innovators',
      count: '20+',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      title: 'Project Showcases',
      description: 'Platform to present your innovations',
      count: '15+',
      gradient: 'from-orange-600 to-red-600'
    }
  ]

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
            What We <span className="gradient-text">Offer</span>
          </h2>
          <p className="body-text max-w-3xl mx-auto">
            Explore a wide range of technologies and activities designed to enhance your skills 
            and prepare you for the future of technology.
          </p>
        </motion.div>

        {/* Technologies Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-10">
            Technologies We <span className="gradient-text">Explore</span>
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.05 * index,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                className="flex flex-col items-center justify-center p-4 rounded-xl glass-card hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <tech.icon className={`w-8 h-8 mb-2 ${tech.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-center font-medium">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activities Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${activity.gradient.split(' ')[1]}, ${activity.gradient.split(' ')[3]})`
                }}
              />
              <div className="relative p-6 rounded-xl glass-card h-full">
                <div className={`text-3xl font-bold bg-gradient-to-r ${activity.gradient} bg-clip-text text-transparent mb-2`}>
                  {activity.count}
                </div>
                <h4 className="text-lg font-semibold mb-2">{activity.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-6 rounded-2xl glass-card">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Ready to explore these technologies?</h3>
              <p className="text-gray-600 dark:text-gray-400">Join CSI and start your tech journey today!</p>
            </div>
            <button className="btn-primary whitespace-nowrap">
              Get Started
            </button>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-primary-500 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-20 w-32 h-32 border-4 border-cyber-blue rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-24 h-24 border-4 border-cyber-purple rounded-full animate-pulse delay-2000" />
      </div>
    </section>
  )
}

export default Features
