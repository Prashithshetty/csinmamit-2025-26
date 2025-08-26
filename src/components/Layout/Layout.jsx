import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../UI/ScrollToTop'
import ParticlesBackground from '../UI/ParticlesBackground'

const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Animated Background */}
      <ParticlesBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  )
}

export default Layout
