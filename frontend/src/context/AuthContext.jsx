import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

// Kimlik doğrulama context'i
const AuthContext = createContext(null)

/**
 * Auth context hook
 * Kimlik doğrulama işlemlerine erişim sağlar
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * Kimlik Doğrulama Provider
 * Kullanıcı girişi, kaydı ve çıkışı yönetir
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Uygulama başlatıldığında kullanıcı oturumunu kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  /**
   * Kullanıcı girişi
   * @param {string} email - Kullanıcı e-postası
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<Object>} Başarı/hata durumu
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  /**
   * Yeni kullanıcı kaydı
   * @param {string} name - Kullanıcı adı
   * @param {string} email - E-posta adresi
   * @param {string} password - Şifre
   * @param {string} confirmPassword - Şifre tekrarı
   * @returns {Promise<Object>} Başarı/hata durumu
   */
  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await authAPI.register({ 
        name, 
        email, 
        password, 
        confirmPassword 
      })
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  /**
   * Kullanıcı çıkışı
   * Tüm oturum verilerini temizler
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
