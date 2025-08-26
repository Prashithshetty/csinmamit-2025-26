import Hero from '../components/Home/Hero'
import About from '../components/Home/About'
import Features from '../components/Home/Features'
import Highlights from '../components/Home/Highlights'
import Testimonials from '../components/Home/Testimonials'
import CTA from '../components/Home/CTA'

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Features />
      <Highlights />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default Home
