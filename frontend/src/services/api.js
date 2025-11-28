import axios from 'axios'

// API'nin temel URL'i (ortam değişkeninden veya varsayılan değerden alınır)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Ana API istemcisi
 * Tüm HTTP istekleri için merkezi yapılandırma sağlar
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * İstek öncesi interceptor
 * Her istekte Authorization header'ına token ekler
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Yanıt sonrası interceptor
 * 401 (Yetkisiz) hatalarını yakalar ve kullanıcıyı ana sayfaya yönlendirir
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Yetkisiz erişim durumunda kullanıcıyı çıkış yap ve ana sayfaya yönlendir
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

/**
 * Kimlik doğrulama API fonksiyonları
 */
export const authAPI = {
  // Yeni kullanıcı kaydı
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // Kullanıcı girişi
  login: async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  // Mevcut kullanıcı bilgilerini getir
  getMe: async () => {
    const response = await api.get('/me')
    return response.data
  },
}

export default api
