import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Tilt from 'react-parallax-tilt'
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  Users2, 
  GraduationCap,
  Award
} from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // const features = [
  //   {
  //     icon: Rocket,
  //     title: 'Innovation Hub',
  //     description: 'Foster creativity and bring groundbreaking ideas to life through collaborative projects.',
  //     color: 'from-blue-500 to-cyan-500'
  //   },
  //   {
  //     icon: Target,
  //     title: 'Skill Development',
  //     description: 'Master cutting-edge technologies through hands-on workshops and expert mentorship.',
  //     color: 'from-purple-500 to-pink-500'
  //   },
  //   {
  //     icon: Lightbulb,
  //     title: 'Tech Excellence',
  //     description: 'Stay ahead with the latest industry trends and emerging technologies.',
  //     color: 'from-green-500 to-teal-500'
  //   },
  //   {
  //     icon: Users2,
  //     title: 'Community',
  //     description: 'Connect with like-minded tech enthusiasts and industry professionals.',
  //     color: 'from-orange-500 to-red-500'
  //   },
  //   {
  //     icon: GraduationCap,
  //     title: 'Learning Path',
  //     description: 'Structured learning programs designed for all skill levels.',
  //     color: 'from-indigo-500 to-purple-500'
  //   },
  //   {
  //     icon: Award,
  //     title: 'Recognition',
  //     description: 'Showcase your skills in competitions and earn industry recognition.',
  //     color: 'from-pink-500 to-rose-500'
  //   }
  // ]

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
            About <span className="gradient-text">CSI NMAMIT</span>
          </h2>
          <p className="body-text max-w-3xl mx-auto">
            We are not just an organization; we are a family that fosters growth, innovation, 
            and a shared passion for all things tech. Join us in shaping the future of technology.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Excellence in Technology Education
                </span>
              </div>
              
              <h3 className="heading-3">
                Transforming Students into 
                <span className="block gradient-text">Tech Leaders</span>
              </h3>
              
              <p className="body-text">
                At CSI NMAMIT, we believe in shaping the future of technology enthusiasts 
                by providing a holistic perspective on development and empowering students 
                to turn their ideas into impactful solutions.
              </p>
              
              <div className="space-y-4">
                {['Industry Connections', 'Practical Learning', 'Career Growth'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-cyber-blue" />
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1000}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/team.jpg"
                  alt="CSI Team"
                  className="w-full h-auto rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-2xl font-bold">10+ Years</p>
                  <p className="text-sm">of Excellence</p>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>

        {/* Feature Cards */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.05}
                className="h-full"
              >
                <div className="h-full p-6 rounded-xl glass-card hover:shadow-2xl transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div> */}
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-cyber-blue/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  )
}

export default About
