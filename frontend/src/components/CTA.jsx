import { useState } from 'react'
import LoginModal from './LoginModal'
import { useLanguage } from '../context/LanguageContext'

function CTA() {
  const { t } = useLanguage()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <section className="py-20 px-4 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('readyToStart')}
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            {t('joinThousands')}
          </p>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
