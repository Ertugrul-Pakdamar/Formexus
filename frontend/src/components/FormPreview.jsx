import { useLanguage } from '../context/LanguageContext'

export default function FormPreview({ form }) {
  const { t } = useLanguage()
  
  return (
    <div 
      className="rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
      style={{
        backgroundColor: form.theme?.backgroundColor || '#ffffff',
        fontFamily: form.theme?.fontFamily || 'Inter, system-ui, sans-serif'
      }}
    >
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: form.theme?.primaryColor || '#6366f1' }}
        >
          {form.title}
        </h1>
        {form.description && <p className="text-gray-600">{form.description}</p>}
      </div>

      <div className="space-y-6">
        {form.fields.map((field, index) => (
          <FieldPreview 
            key={field.id} 
            field={field} 
            index={index} 
            primaryColor={form.theme?.primaryColor || '#6366f1'}
            t={t}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t">
        <button
          disabled
          className="w-full text-white py-3 px-6 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: form.theme?.primaryColor || '#6366f1' }}
        >
          {t('submit')} ({t('previewMode')})
        </button>
      </div>
    </div>
  )
}

function FieldPreview({ field, index, primaryColor, t }) {
  if (field.type === 'section') {
    return (
      <div className="pt-6 pb-2">
        <h2 className="text-2xl font-bold text-gray-900">{field.label}</h2>
        {field.description && <p className="text-gray-600 mt-1">{field.description}</p>}
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {index + 1}. {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.description && <p className="text-sm text-gray-600 mb-3">{field.description}</p>}

      <div className="field-input">
        {renderFieldInput(field, primaryColor, t)}
      </div>
    </div>
  )
}

function renderFieldInput(field, primaryColor, t) {
  switch (field.type) {
    case 'short_text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
          placeholder={field.placeholder || t('yourAnswer')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          disabled
        />
      )

    case 'long_text':
      return (
        <textarea
          placeholder={field.placeholder || t('yourAnswer')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
          style={{ '--tw-ring-color': primaryColor }}
          rows={4}
          disabled
        />
      )

    case 'number':
      return (
        <input
          type="number"
          placeholder="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled
        />
      )

    case 'date':
      return (
        <input
          type="date"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled
        />
      )

    case 'time':
      return (
        <input
          type="time"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled
        />
      )

    case 'datetime':
      return (
        <input
          type="datetime-local"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled
        />
      )

    case 'single_choice':
      return (
        <div className="space-y-2">
          {field.options?.map((option, idx) => (
            <label key={idx} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={option}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                disabled
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )

    case 'multi_choice':
      return (
        <div className="space-y-2">
          {field.options?.map((option, idx) => (
            <label key={idx} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )

    case 'dropdown':
      return (
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          disabled
        >
          <option value="">{t('selectOption')}</option>
          {field.options?.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      )

    case 'linear_scale':
      return (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{field.minValue || 1}</span>
          <div className="flex space-x-2">
            {Array.from(
              { length: (field.maxValue || 5) - (field.minValue || 1) + 1 },
              (_, i) => i + (field.minValue || 1)
            ).map((value) => (
              <button
                key={value}
                className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition font-medium disabled:opacity-50"
                disabled
              >
                {value}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">{field.maxValue || 5}</span>
        </div>
      )

    case 'rating':
      return (
        <div className="flex space-x-1">
          {Array.from({ length: field.maxValue || 5 }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              className="text-gray-300 hover:text-yellow-400 transition disabled:opacity-50"
              disabled
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          ))}
        </div>
      )

    default:
      return (
        <div className="text-gray-400 italic">Preview not available for this field type</div>
      )
  }
}
