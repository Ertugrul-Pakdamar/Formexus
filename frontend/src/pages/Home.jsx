import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import LanguageSwitcher from '../components/LanguageSwitcher'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Language Switcher - Top Right */}
      <div className="fixed top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>
      
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home
