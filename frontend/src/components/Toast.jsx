import { useEffect } from 'react'

function Toast({ isOpen, onClose, message, type = 'success', duration = 3000 }) {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const typeStyles = {
    success: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-600',
      textClass: 'text-green-800'
    },
    error: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bgClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-600',
      textClass: 'text-red-800'
    },
    info: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-800'
    }
  }

  const style = typeStyles[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${style.bgClass}`}>
        <div className={style.iconClass}>
          {style.icon}
        </div>
        <p className={`text-sm font-medium ${style.textClass}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-2 ${style.iconClass} hover:opacity-70`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast
