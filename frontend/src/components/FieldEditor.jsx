/**
 * Alan Düzenleyici Bileşeni
 * Form alanlarını düzenlemek için kullanılan bileşen
 * 
 * @param {Object} field - Düzenlenecek alan
 * @param {number} index - Alan indexi
 * @param {boolean} isSelected - Alanın seçili olup olmadığı
 * @param {Function} onUpdate - Alan güncellendiğinde çağrılacak fonksiyon
 * @param {Function} onDelete - Alan silindiğinde çağrılacak fonksiyon
 * @param {Function} onMoveUp - Alan yukarı taşındığında çağrılacak fonksiyon
 * @param {Function} onMoveDown - Alan aşağı taşındığında çağrılacak fonksiyon
 * @param {Function} onDuplicate - Alan kopyalandığında çağrılacak fonksiyon
 * @param {boolean} canMoveUp - Yukarı taşıma yapılabilir mi
 * @param {boolean} canMoveDown - Aşağı taşıma yapılabilir mi
 */
export default function FieldEditor({
  field,
  index,
  isSelected,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  canMoveUp,
  canMoveDown,
}) {
  // Alanın seçeneklere ihtiyacı var mı (radio, checkbox, dropdown)
  const hasOptions = ['single_choice', 'multi_choice', 'dropdown'].includes(field.type)
  // Alanın ölçeğe ihtiyacı var mı (linear scale, rating)
  const hasScale = ['linear_scale', 'rating'].includes(field.type)

  /**
   * Yeni seçenek ekler
   */
  const addOption = () => {
    const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
    onUpdate({ options: newOptions })
  }

  /**
   * Seçeneği günceller
   * @param {number} optionIndex - Seçenek indexi
   * @param {string} value - Yeni değer
   */
  const updateOption = (optionIndex, value) => {
    const newOptions = [...field.options]
    newOptions[optionIndex] = value
    onUpdate({ options: newOptions })
  }

  /**
   * Seçeneği siler
   * @param {number} optionIndex - Silinecek seçenek indexi
   */
  const deleteOption = (optionIndex) => {
    const newOptions = field.options.filter((_, i) => i !== optionIndex)
    onUpdate({ options: newOptions })
  }

  // Bölüm başlığı için özel render
  if (field.type === 'section') {
    return (
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="text-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 flex-1"
            placeholder="Section Title"
          />
          {isSelected && (
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                title="Move up"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                title="Move down"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={onDuplicate}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Duplicate"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-700" title="Delete">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {isSelected && (
          <textarea
            value={field.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Section description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={2}
          />
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="text-lg font-medium border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 flex-1"
              placeholder="Question"
            />
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
              />
              Required
            </label>
          </div>
          {isSelected && (
            <input
              type="text"
              value={field.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          )}
        </div>

        {isSelected && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
              title="Move up"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
              title="Move down"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={onDuplicate}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Duplicate"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-700" title="Delete">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Field-specific options */}
      {hasOptions && isSelected && (
        <div className="mt-4 space-y-2">
          {field.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <span className="text-gray-400">
                {field.type === 'single_choice' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2}/>
                    <circle cx="12" cy="12" r="4" fill="currentColor"/>
                  </svg>
                ) : field.type === 'multi_choice' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : `${optionIndex + 1}.`}
              </span>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(optionIndex, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {field.options.length > 1 && (
                <button
                  onClick={() => deleteOption(optionIndex)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Add option
          </button>
        </div>
      )}

      {hasScale && isSelected && (
        <div className="mt-4 flex items-center space-x-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min</label>
            <input
              type="number"
              value={field.minValue || 1}
              onChange={(e) => onUpdate({ minValue: parseInt(e.target.value) })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max</label>
            <input
              type="number"
              value={field.maxValue || 5}
              onChange={(e) => onUpdate({ maxValue: parseInt(e.target.value) })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {!isSelected && (
        <div className="mt-2 text-sm text-gray-400 italic">
          {getFieldPreview(field)}
        </div>
      )}
    </div>
  )
}

function getFieldPreview(field) {
  const previews = {
    short_text: 'Short answer text',
    long_text: 'Long answer text...',
    email: 'email@example.com',
    number: '123',
    phone: '+1 234 567 8900',
    url: 'https://example.com',
    date: 'DD/MM/YYYY',
    time: 'HH:MM',
    datetime: 'DD/MM/YYYY HH:MM',
    single_choice: field.options?.[0] || 'Option',
    multi_choice: field.options?.[0] || 'Option',
    dropdown: 'Select an option',
    linear_scale: `${field.minValue || 1} to ${field.maxValue || 5}`,
    rating: `${field.maxValue || 5} stars`,
  }
  return previews[field.type] || ''
}
