import { useLanguage } from '../context/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="py-8 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto text-center text-gray-400">
        <p>&copy; 2025 Formexus. {t('allRightsReserved')}</p>
      </div>
    </footer>
  )
}

export default Footer
