import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  Instagram,
  Heart,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Quick Links': [
      { label: 'Home', path: '/' },
      { label: 'Events', path: '/events' },
      { label: 'Team', path: '/team' },
      { label: 'Join CSI', path: '/recruit' },
    ],
    'Resources': [
      { label: 'About CSI', path: '#' },
      { label: 'Membership Benefits', path: '#' },
      { label: 'Past Events', path: '/events' },
      { label: 'Gallery', path: '#' },
    ],
    'Connect': [
      { label: 'Contact Us', path: '#', icon: Mail },
      { label: 'NMAMIT Website', path: 'https://nmamit.nitte.edu.in', external: true },
      { label: 'CSI India', path: 'https://www.csi-india.org', external: true },
      { label: 'Feedback', path: '#' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="relative mt-20 border-t border-gray-200 dark:border-gray-800">
      {/* Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
      
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/csi-logo.png" 
                alt="CSI Logo" 
                className="h-12 w-12"
              />
              <div>
                <h3 className="text-xl font-bold gradient-text">CSI NMAMIT</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Computer Society of India
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Empowering students through technology, innovation, and community. 
              Join us in shaping the future of tech at NMAMIT.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:csi@nmamit.in" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Mail size={18} />
                <span>csi@nmamit.in</span>
              </a>
              <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>
                  NMAM Institute of Technology,<br />
                  Nitte, Karkala Taluk,<br />
                  Udupi - 574110
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, path, external, icon: Icon }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors group"
                      >
                        {Icon && <Icon size={16} />}
                        <span>{label}</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={path}
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                      >
                        {Icon && <Icon size={16} />}
                        <span>{label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Stay Updated
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subscribe to our newsletter for latest events and updates
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field sm:w-64"
              />
              <button className="btn-primary flex items-center justify-center space-x-2">
                <span>Subscribe</span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} CSI NMAMIT. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <Link to="#" className="hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="#" className="hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span>by CSI Tech Team</span>
            </p>
          </div>
        </div>
      </div>

      {/* Animated Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <svg
          className="relative block w-full h-20 text-primary-500/5"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <motion.path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 10,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    </footer>
  )
}

export default Footer
