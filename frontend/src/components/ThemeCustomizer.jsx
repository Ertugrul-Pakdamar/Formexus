import { useLanguage } from '../context/LanguageContext'

export default function ThemeCustomizer({ form, onChange }) {
  const { t } = useLanguage()
  
  const themeColors = [
    { name: 'purple', value: '#6366f1', bg: 'bg-purple-500' },
    { name: 'blue', value: '#3b82f6', bg: 'bg-blue-500' },
    { name: 'green', value: '#10b981', bg: 'bg-green-500' },
    { name: 'pink', value: '#ec4899', bg: 'bg-pink-500' },
    { name: 'indigo', value: '#4f46e5', bg: 'bg-indigo-500' },
    { name: 'orange', value: '#f97316', bg: 'bg-orange-500' },
  ]

  const backgroundColors = [
    { name: 'white', value: '#ffffff', bg: 'bg-white', border: 'border' },
    { name: 'lightGray', value: '#f9fafb', bg: 'bg-gray-50' },
    { name: 'lightBlue', value: '#eff6ff', bg: 'bg-blue-50' },
    { name: 'lightPurple', value: '#f5f3ff', bg: 'bg-purple-50' },
    { name: 'lightPink', value: '#fdf2f8', bg: 'bg-pink-50' },
  ]

  const updateTheme = (updates) => {
    onChange({
      ...form,
      theme: {
        ...form.theme,
        ...updates,
      },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('themeCustomization')}</h3>
      </div>

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('primaryColor')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateTheme({ primaryColor: color.value })}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition ${
                form.theme?.primaryColor === color.value
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full ${color.bg}`}></div>
              <span className="text-sm font-medium text-gray-700">{t(color.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('backgroundColor')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {backgroundColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateTheme({ backgroundColor: color.value })}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition ${
                form.theme?.backgroundColor === color.value
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded ${color.bg} ${color.border || ''}`}></div>
              <span className="text-sm font-medium text-gray-700">{t(color.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('previewTheme')}
        </label>
        <div
          className="p-6 rounded-lg border-2"
          style={{ backgroundColor: form.theme?.backgroundColor || '#ffffff' }}
        >
          <button
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: form.theme?.primaryColor || '#6366f1' }}
          >
            {t('sampleButton')}
          </button>
          <div className="mt-4">
            <div
              className="h-2 w-32 rounded"
              style={{ backgroundColor: form.theme?.primaryColor || '#6366f1' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
