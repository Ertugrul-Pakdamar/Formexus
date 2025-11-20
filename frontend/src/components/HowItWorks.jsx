import { useLanguage } from '../context/LanguageContext'

function HowItWorks() {
  const { t } = useLanguage()
  
  const steps = [
    {
      number: 1,
      titleKey: "chooseTemplateStep",
      descriptionKey: "chooseTemplateStepDesc",
      reverse: false,
      icon: (
        <svg className="w-full h-full p-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="30" width="120" height="140" rx="8" fill="#E9D5FF" stroke="#9333EA" strokeWidth="3"/>
          <rect x="55" y="50" width="90" height="8" rx="4" fill="#9333EA"/>
          <rect x="55" y="70" width="70" height="6" rx="3" fill="#C084FC"/>
          <rect x="55" y="85" width="85" height="6" rx="3" fill="#C084FC"/>
          <circle cx="65" cy="115" r="5" fill="#9333EA"/>
          <circle cx="85" cy="115" r="5" fill="#C084FC"/>
          <circle cx="105" cy="115" r="5" fill="#E9D5FF" stroke="#9333EA" strokeWidth="2"/>
          <rect x="55" y="135" width="90" height="25" rx="4" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2"/>
          <path d="M 90 145 L 95 150 L 105 140" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )
    },
    {
      number: 2,
      titleKey: "addQuestions",
      descriptionKey: "addQuestionsDesc",
      reverse: true,
      icon: (
        <svg className="w-full h-full p-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="40" width="140" height="120" rx="8" fill="#F3E8FF" stroke="#9333EA" strokeWidth="3"/>
          <line x1="50" y1="65" x2="150" y2="65" stroke="#C084FC" strokeWidth="2"/>
          <line x1="50" y1="85" x2="130" y2="85" stroke="#C084FC" strokeWidth="2"/>
          <rect x="45" y="100" width="110" height="15" rx="4" fill="white" stroke="#9333EA" strokeWidth="2"/>
          <circle cx="50" cy="130" r="4" fill="#9333EA"/>
          <line x1="60" y1="130" x2="120" y2="130" stroke="#C084FC" strokeWidth="2"/>
          <circle cx="50" cy="145" r="4" fill="#9333EA"/>
          <line x1="60" y1="145" x2="110" y2="145" stroke="#C084FC" strokeWidth="2"/>
          <path d="M 165 50 L 175 60 L 165 70" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )
    },
    {
      number: 3,
      titleKey: "shareCollect",
      descriptionKey: "shareCollectDesc",
      reverse: false,
      icon: (
        <svg className="w-full h-full p-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="60" fill="#F3E8FF" stroke="#9333EA" strokeWidth="3"/>
          <path d="M 70 100 L 90 120 L 130 70" stroke="#9333EA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="45" cy="60" r="15" fill="#E9D5FF" stroke="#9333EA" strokeWidth="2"/>
          <circle cx="155" cy="60" r="15" fill="#E9D5FF" stroke="#9333EA" strokeWidth="2"/>
          <circle cx="45" cy="140" r="15" fill="#E9D5FF" stroke="#9333EA" strokeWidth="2"/>
          <circle cx="155" cy="140" r="15" fill="#E9D5FF" stroke="#9333EA" strokeWidth="2"/>
          <path d="M 55 65 L 70 85" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 145 65 L 130 85" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 55 135 L 70 115" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 145 135 L 130 115" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="45" cy="60" r="5" fill="white"/>
          <circle cx="155" cy="60" r="5" fill="white"/>
          <circle cx="45" cy="140" r="5" fill="white"/>
          <circle cx="155" cy="140" r="5" fill="white"/>
        </svg>
      )
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16 px-2">
          {t('howIt')} <span className="text-purple-600">{t('works')}</span>
        </h2>
        
        <div className="space-y-8 sm:space-y-12">
          {steps.map((step) => (
            <div key={step.number} className={`flex flex-col ${step.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-4 sm:gap-6 lg:gap-8`}>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
                    {step.number}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t(step.titleKey)}</h3>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">{t(step.descriptionKey)}</p>
              </div>
              <div className="flex-1 w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center hover:shadow-2xl transition-shadow duration-300">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
