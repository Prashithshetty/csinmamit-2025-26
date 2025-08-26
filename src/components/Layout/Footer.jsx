import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Heart,
  ExternalLink,
  Send,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Team", path: "/team" },
    { label: "Join CSI", path: "/recruit" },
    { label: "About", path: "#" },
    { label: "Gallery", path: "#" },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <img src="/csi-logo.png" alt="CSI" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  CSI NMAMIT
                </h3>
                <p className="text-sm text-gray-500">Computer Society of India</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              Empowering the next generation of tech innovators through community, 
              learning, and hands-on experience at NMAM Institute of Technology.
            </p>
            
            {/* Contact Info - Clean & Simple */}
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:csi@nmamit.in"
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors group"
              >
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  <Mail size={16} />
                </div>
                <span>csi@nmamit.in</span>
              </a>
              
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mt-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p>NMAM Institute of Technology</p>
                  <p>Nitte, Udupi - 574110, Karnataka</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 mr-2">Follow us:</span>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {quickLinks.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Stay Connected
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get updates on events, workshops, and opportunities.
            </p>
            
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center">
                <Send size={16} />
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col gap-2 text-sm">
                <a href="https://nmamit.nitte.edu.in" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  <span>NMAMIT Website</span>
                  <ExternalLink size={14} />
                </a>
                <a href="https://www.csi-india.org" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  <span>CSI India</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} CSI NMAMIT</span>
              <Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-blue-600 transition-colors">Terms</Link>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-red-500 mx-1" />
              <span>by</span>
              <Link 
                to="/tech-team" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
              >
                CSI Tech Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;