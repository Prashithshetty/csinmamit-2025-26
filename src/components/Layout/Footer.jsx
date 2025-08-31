import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink,
  Send,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    // Optional WhatsApp in social row:
    { icon: Phone, href: "https://chat.whatsapp.com/CXDGmvLicDmE53p9uQJIMC?mode=ac_t", label: "WhatsApp" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer */}
      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/csi-logo.png" alt="CSI" className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">CSI NMAMIT</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Computer Society of India</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-xs">
            Inspiring innovation and collaboration through events, workshops, and opportunities for tech enthusiasts.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://nitte.edu.in" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                NMAMIT Website <ExternalLink size={14} />
              </a>
            </li>
            <li>
              <a href="https://www.csi-india.org" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                CSI India <ExternalLink size={14} />
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Contact</h4>
          <div className="space-y-4 text-sm">
            <a href="mailto:csi@nmamit.in" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors group">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
                <Mail size={16} />
              </div>
              <span>csi@nmamit.in</span>
            </a>

            {/* WhatsApp group invite link */}
            <a href="https://chat.whatsapp.com/CXDGmvLicDmE53p9uQJIMC?mode=ac_t" // <-- replace with your actual group link
               target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors group">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                <Phone size={16} />
              </div>
              <span>Join our WhatsApp Group</span>
            </a>

            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <div>
                <p>NMAM Institute of Technology</p>
                <p>Nitte, Udupi - 574110, Karnataka</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Stay Connected</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get updates on events, workshops, and opportunities.</p>
          <div className="relative">
            <input type="email" placeholder="Enter your email"
                   className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <button className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">© {currentYear} CSI NMAMIT. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.15, y: -3 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400
                                   ${label === "WhatsApp" ? "bg-green-50 dark:bg-green-900/10 hover:bg-green-600 hover:text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white"}
                                   shadow-sm transition-all duration-300`}
                        aria-label={label}>
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
