import { useLanguage } from '../context/LanguageContext'

function HowItWorks() {
  const { t } = useLanguage()
  
  const steps = [
    {
      number: 1,
      titleKey: "chooseTemplateStep",
      descriptionKey: "chooseTemplateStepDesc",
      reverse: false
    },
    {
      number: 2,
      titleKey: "addQuestions",
      descriptionKey: "addQuestionsDesc",
      reverse: true
    },
    {
      number: 3,
      titleKey: "shareCollect",
      descriptionKey: "shareCollectDesc",
      reverse: false
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          {t('howIt')} <span className="text-purple-600">{t('works')}</span>
        </h2>
        
        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.number} className={`flex flex-col ${step.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900">{t(step.titleKey)}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">{t(step.descriptionKey)}</p>
              </div>
              <div className="flex-1 w-full h-64 bg-purple-100 rounded-xl shadow-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
