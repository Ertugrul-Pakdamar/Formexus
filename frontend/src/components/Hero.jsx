import { useState } from 'react'
import LoginModal from './LoginModal'
import { useLanguage } from '../context/LanguageContext'

function Hero() {
  const { t } = useLanguage()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const scrollToFeatures = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <section className="h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Logo - Top Left */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-purple-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-800 tracking-tight">Formexus</span>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          {/* Floating shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-purple-400 rounded-lg opacity-20 animate-float"></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-4 border-purple-500 rounded-full opacity-20 animate-float animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-purple-400 rounded-full opacity-10 animate-float animation-delay-3000"></div>
        </div>

        <div className="text-center max-w-4xl mx-auto animate-slide-up relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            {t('welcomeTo')} <span className="text-purple-600">Formexus</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            {t('heroDescription')}
          </p>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t('createForm')}
          </button>
        </div>

        {/* Scroll Down Button */}
        <button 
          onClick={scrollToFeatures}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-purple-50 animate-bounce-slow group"
          aria-label="Scroll to features"
        >
          <svg 
            className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

export default Hero
