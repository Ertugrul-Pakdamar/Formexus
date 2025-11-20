import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import formAPI from '../services/formApi'
import Toast from '../components/Toast'
import { useLanguage } from '../context/LanguageContext'

export default function PublicFormView() {
  const { slug } = useParams()
  const { t } = useLanguage()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' })

  useEffect(() => {
    loadForm()
  }, [slug])

  const loadForm = async () => {
    try {
      setLoading(true)
      const data = await formAPI.getPublicForm(slug)
      setForm(data)
    } catch (error) {
      console.error('Error loading form:', error)
      setToast({ isOpen: true, message: t('formNotFoundOrUnavailable'), type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldId, value) => {
    setResponses({ ...responses, [fieldId]: value })
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    form.fields.forEach((field) => {
      if (field.required && field.type !== 'section') {
        const value = responses[field.id]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = t('fieldRequired')
        }
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setToast({ isOpen: true, message: t('fillAllRequired'), type: 'error' })
      return
    }

    try {
      setSubmitting(true)
      await formAPI.submitForm(slug, responses)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setToast({ isOpen: true, message: error.response?.data?.message || t('failedToSubmit'), type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loadingForm')}</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('formNotFound')}</h2>
          <p className="mt-2 text-gray-600">{t('formDeletedOrUnavailable')}</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('thankYou')}</h2>
          <p className="text-gray-600">
            {form.settings.confirmationMessage || t('responseRecorded')}
          </p>
          {form.settings.redirectUrl && (
            <a
              href={form.settings.redirectUrl}
              className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              {t('continue')}
            </a>
          )}
        </div>
      </div>
    )
  }

  const visibleFields = form.fields.filter((field) => field.type !== 'section' || field.label)
  const totalSteps = form.settings.showProgressBar
    ? visibleFields.filter((f) => f.type !== 'section').length
    : 0
  const answeredFields = Object.keys(responses).filter((key) => responses[key]).length
  const progress = totalSteps > 0 ? (answeredFields / totalSteps) * 100 : 0

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{
        backgroundColor: form.theme.backgroundColor || '#f9fafb',
        fontFamily: form.theme.fontFamily || 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        {form.settings.showProgressBar && totalSteps > 0 && (
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: form.theme.primaryColor || '#6366f1',
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {answeredFields} {t('of')} {totalSteps} {t('answered')}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          {form.theme.logoUrl && (
            <div className="mb-6 text-center">
              <img src={form.theme.logoUrl} alt="Logo" className="h-16 mx-auto" />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: form.theme.primaryColor || '#6366f1' }}
            >
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-6">
            {form.fields.map((field, index) => (
              <FormField
                key={field.id}
                field={field}
                index={index}
                value={responses[field.id]}
                onChange={(value) => handleInputChange(field.id, value)}
                error={errors[field.id]}
                primaryColor={form.theme.primaryColor}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 rounded-lg font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: form.theme.primaryColor || '#6366f1' }}
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>

        {/* Branding */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Powered by <span className="font-semibold">Formexus</span>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  )
}

function FormField({ field, index, value, onChange, error, primaryColor }) {
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
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.description && <p className="text-sm text-gray-600 mb-3">{field.description}</p>}

      <div>
        {renderField(field, value, onChange, primaryColor)}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function renderField(field, value, onChange, primaryColor) {
  switch (field.type) {
    case 'short_text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || t('yourAnswer')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          required={field.required}
        />
      )

    case 'long_text':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || t('yourAnswer')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
          style={{ '--tw-ring-color': primaryColor }}
          rows={4}
          required={field.required}
        />
      )

    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={field.minValue}
          max={field.maxValue}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          required={field.required}
        />
      )

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          required={field.required}
        />
      )

    case 'time':
      return (
        <input
          type="time"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          required={field.required}
        />
      )

    case 'datetime':
      return (
        <input
          type="datetime-local"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          required={field.required}
        />
      )

    case 'single_choice':
      return (
        <div className="space-y-2">
          {field.options?.map((option, idx) => (
            <label key={idx} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 border-gray-300"
                style={{ accentColor: primaryColor }}
                required={field.required}
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
            <label key={idx} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                value={option}
                checked={(value || []).includes(option)}
                onChange={(e) => {
                  const currentValues = value || []
                  if (e.target.checked) {
                    onChange([...currentValues, option])
                  } else {
                    onChange(currentValues.filter((v) => v !== option))
                  }
                }}
                className="w-4 h-4 border-gray-300 rounded"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': primaryColor }}
          required={field.required}
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
            ).map((scaleValue) => (
              <button
                key={scaleValue}
                type="button"
                onClick={() => onChange(scaleValue)}
                className={`w-12 h-12 rounded-full border-2 transition font-medium ${
                  value === scaleValue
                    ? 'border-transparent text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={
                  value === scaleValue
                    ? { backgroundColor: primaryColor }
                    : {}
                }
              >
                {scaleValue}
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
              type="button"
              onClick={() => onChange(star)}
              className="transition"
            >
              <svg 
                className="w-8 h-8" 
                fill={value >= star ? primaryColor || '#6366f1' : '#d1d5db'} 
                viewBox="0 0 24 24"
              >
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          ))}
        </div>
      )

    default:
      return <div className="text-gray-400 italic">Unsupported field type</div>
  }
}
