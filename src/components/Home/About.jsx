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
return (
    <section className="py-8 md:py-12 lg:py-16 relative" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
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
        <div className="grid lg:grid-cols-2 gap-6 items-center ">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-3">
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
              
              <div className="space-y-2">
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
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold">10+ Years</p>
                  <p className="text-sm">of Excellence</p>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>

      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-cyber-blue/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  )
}

export default About
