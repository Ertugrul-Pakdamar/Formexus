import { useState } from 'react'
import LoginModal from './LoginModal'
import { useLanguage } from '../context/LanguageContext'

function CTA() {
  const { t } = useLanguage()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
            {t('readyToStart')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-purple-100 mb-6 sm:mb-8 px-4">
            {t('joinThousands')}
          </p>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t('createYourFirstForm')}
          </button>
        </div>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

export default CTA
