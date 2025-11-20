import { useLanguage } from '../context/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-6xl mx-auto text-center text-gray-400">
        <p className="text-sm sm:text-base">&copy; 2025 Formexus. {t('allRightsReserved')}</p>
      </div>
    </footer>
  )
}

export default Footer
