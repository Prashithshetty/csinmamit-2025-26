import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../UI/ScrollToTop'
import ParticlesBackground from '../UI/ParticlesBackground'

const Layout = () => {
  const location = useLocation()
  
  // More reliable way to detect 404 - check if we're on an unknown route
  // Since React Router will match the "*" path for any unmatched routes
  const validPaths = ['/', '/events', '/team', '/profile', '/recruit']
  const isNotFoundPage = !validPaths.some(path => 
    path === location.pathname || (path !== '/' && location.pathname.startsWith(path))
  )
  
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Animated Background */}
      <ParticlesBackground />
      
      {/* Navigation - Hidden on 404 */}
      {!isNotFoundPage && <Navbar />}
      
      {/* Main Content */}
      <main className={`flex-grow relative z-10 ${isNotFoundPage ? '' : 'pb-20 lg:pb-0'}`}>
        <Outlet />
      </main>
      
      {/* Footer - Hidden on 404 */}
      {!isNotFoundPage && <Footer />}
      
      {/* Scroll to Top Button - Hidden on 404 */}
      {!isNotFoundPage && <ScrollToTop />}
    </div>
  )
}

export default Layout