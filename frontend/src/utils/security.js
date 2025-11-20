// Security utilities for frontend

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (html) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHTML = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return String(text).replace(/[&<>"'/]/g, (char) => map[char])
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' }
  }
  
  // Optional: Add more strict requirements
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: false, 
      message: 'Password must contain uppercase, lowercase, and numbers' 
    }
  }
  
  return { isValid: true, message: 'Password is strong' }
}

/**
 * Check if input contains potentially dangerous content
 * @param {string} input - Input to check
 * @returns {boolean} - True if input appears safe
 */
export const isSafeInput = (input) => {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(input))
}

/**
 * Sanitize form input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  // Remove script tags and event handlers
  let sanitized = input.replace(/<script[^>]*>.*?<\/script>/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  return sanitized.trim()
}

/**
 * Secure local storage operations
 */
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = btoa(JSON.stringify(value)) // Simple encoding (not encryption)
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  },
  
  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      return JSON.parse(atob(encrypted))
    } catch (error) {
      console.error('Failed to read from storage:', error)
      return null
    }
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key)
  },
  
  clear: () => {
    localStorage.clear()
  }
}

export default {
  sanitizeHTML,
  escapeHTML,
  validateEmail,
  validatePassword,
  isSafeInput,
  sanitizeInput,
  secureStorage,
}
