import { useState } from 'react'
import FieldEditor from './FieldEditor'
import { useLanguage } from '../context/LanguageContext'

/**
 * Kullanılabilir form alan tipleri
 * Her tip için ikon ve etiket içerir
 */
const FIELD_TYPES = [
  { 
    value: 'short_text', 
    label: 'Short Text', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
  },
  { 
    value: 'long_text', 
    label: 'Long Text', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  },
  { 
    value: 'email', 
    label: 'Email', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  { 
    value: 'number', 
    label: 'Number', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
  },
  { 
    value: 'phone', 
    label: 'Phone', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
  },
  { 
    value: 'url', 
    label: 'URL', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
  },
  { 
    value: 'date', 
    label: 'Date', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  { 
    value: 'time', 
    label: 'Time', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  { 
    value: 'datetime', 
    label: 'Date & Time', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  { 
    value: 'single_choice', 
    label: 'Single Choice', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth={2}/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
  },
  { 
    value: 'multi_choice', 
    label: 'Multiple Choice', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  { 
    value: 'dropdown', 
    label: 'Dropdown', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
  },
  { 
    value: 'linear_scale', 
    label: 'Linear Scale', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  },
  { 
    value: 'rating', 
    label: 'Rating', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
  },
  { 
    value: 'section', 
    label: 'Section Header', 
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
  },
]

/**
 * Form Düzenleyici Bileşeni
 * Form alanlarını ekleme, düzenleme ve yönetme işlevlerini sağlar
 */
export default function FormEditor({ form, onChange }) {
  const { t } = useLanguage()
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null) // Seçili alan indexi
  const [showFieldMenu, setShowFieldMenu] = useState(false) // Alan ekleme menüsü görünürlüğü

  /**
   * Forma yeni alan ekler
   * @param {string} type - Eklenecek alan tipi
   */
  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      description: '',
      required: false,
      order: form.fields.length,
      // Seçim alanları için seçenekler ekle
      ...(needsOptions(type) && { options: ['Option 1', 'Option 2', 'Option 3'] }),
      // Ölçek alanları için değer aralıkları
      ...(type === 'linear_scale' && { minValue: 1, maxValue: 5 }),
      ...(type === 'rating' && { maxValue: 5 }),
    }

    onChange({
      ...form,
      fields: [...form.fields, newField],
    })
    setShowFieldMenu(false)
    setSelectedFieldIndex(form.fields.length)
  }

  /**
   * Mevcut alanı günceller
   * @param {number} index - Alan indexi
   * @param {Object} updates - Güncellenecek özellikler
   */
  const updateField = (index, updates) => {
    const newFields = [...form.fields]
    newFields[index] = { ...newFields[index], ...updates }
    onChange({ ...form, fields: newFields })
  }

  /**
   * Alanı siler
   * @param {number} index - Silinecek alan indexi
   */
  const deleteField = (index) => {
    const newFields = form.fields.filter((_, i) => i !== index)
    onChange({ ...form, fields: newFields })
    setSelectedFieldIndex(null)
  }

  /**
   * Alanı yukarı veya aşağı taşır
   * @param {number} index - Taşınacak alan indexi
   * @param {string} direction - Yön ('up' veya 'down')
   */
  const moveField = (index, direction) => {
    const newFields = [...form.fields]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    // Sınır kontrolü
    if (newIndex < 0 || newIndex >= newFields.length) return

    // İki alanın yerini değiştir
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]]
    // Sıra numaralarını güncelle
    newFields.forEach((field, i) => (field.order = i))

    onChange({ ...form, fields: newFields })
    setSelectedFieldIndex(newIndex)
  }

  /**
   * Alanı kopyalar
   * @param {number} index - Kopyalanacak alan indexi
   */
  const duplicateField = (index) => {
    const field = form.fields[index]
    const newField = {
      ...field,
      id: `field_${Date.now()}`,
      label: `${field.label} (Copy)`,
      order: form.fields.length,
    }
    onChange({
      ...form,
      fields: [...form.fields, newField],
    })
  }

  return (
    <div className="space-y-6">
      {/* Form Açıklaması */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('description')}</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            placeholder={t('addDescription')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Form Alanları */}
      {form.fields.map((field, index) => (
        <div
          key={field.id}
          className={`bg-white rounded-lg shadow-sm border transition ${
            selectedFieldIndex === index ? 'ring-2 ring-indigo-500 border-transparent' : ''
          }`}
          onClick={() => setSelectedFieldIndex(index)}
        >
          <FieldEditor
            field={field}
            index={index}
            isSelected={selectedFieldIndex === index}
            onUpdate={(updates) => updateField(index, updates)}
            onDelete={() => deleteField(index)}
            onMoveUp={() => moveField(index, 'up')}
            onMoveDown={() => moveField(index, 'down')}
            onDuplicate={() => duplicateField(index)}
            canMoveUp={index > 0}
            canMoveDown={index < form.fields.length - 1}
          />
        </div>
      ))}

      {/* Alan Ekleme Butonu */}
      <div className="relative">
        <button
          onClick={() => setShowFieldMenu(!showFieldMenu)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition font-medium"
        >
          + {t('addField')}
        </button>

        {/* Alan Tipi Seçim Menüsü */}
        {showFieldMenu && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border max-h-96 overflow-auto">
            <div className="grid grid-cols-2 gap-2 p-4">
              {FIELD_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addField(type.value)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
                >
                  <div className="text-purple-600">{type.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Ayarları */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h3 className="text-lg font-semibold mb-4">{t('formSettings')}</h3>
        
        <div className="space-y-4">
          {/* Çoklu gönderim izni */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.settings.allowMultipleSubmits}
              onChange={(e) =>
                onChange({
                  ...form,
                  settings: { ...form.settings, allowMultipleSubmits: e.target.checked },
                })
              }
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">{t('allowMultipleSubmissions')}</span>
          </label>

          {/* Giriş gereksinimi */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.settings.requireLogin}
              onChange={(e) =>
                onChange({
                  ...form,
                  settings: { ...form.settings, requireLogin: e.target.checked },
                })
              }
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">{t('requireLogin')}</span>
          </label>

          {/* İlerleme çubuğu */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.settings.showProgressBar}
              onChange={(e) =>
                onChange({
                  ...form,
                  settings: { ...form.settings, showProgressBar: e.target.checked },
                })
              }
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">{t('showProgressBar')}</span>
          </label>

          {/* Onay mesajı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('confirmationMessage')}
            </label>
            <input
              type="text"
              value={form.settings.confirmationMessage}
              onChange={(e) =>
                onChange({
                  ...form,
                  settings: { ...form.settings, confirmationMessage: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Alan tipine göre varsayılan etiket döndürür
 * @param {string} type - Alan tipi
 * @returns {string} Varsayılan etiket
 */
function getDefaultLabel(type) {
  const labels = {
    short_text: 'Short Answer',
    long_text: 'Long Answer',
    email: 'Email Address',
    number: 'Number',
    phone: 'Phone Number',
    url: 'Website URL',
    date: 'Date',
    time: 'Time',
    datetime: 'Date and Time',
    single_choice: 'Single Choice Question',
    multi_choice: 'Multiple Choice Question',
    dropdown: 'Dropdown',
    linear_scale: 'Linear Scale',
    rating: 'Rating',
    section: 'Section Title',
  }
  return labels[type] || 'Untitled Question'
}

/**
 * Alan tipinin seçeneklere ihtiyacı olup olmadığını kontrol eder
 * @param {string} type - Alan tipi
 * @returns {boolean} Seçenek gereksinimi
 */
function needsOptions(type) {
  return ['single_choice', 'multi_choice', 'dropdown'].includes(type)
}
