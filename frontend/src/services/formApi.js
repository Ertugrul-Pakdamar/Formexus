import api from './api'

/**
 * Form API fonksiyonları
 * Form CRUD işlemleri, form gönderme ve istatistik işlemlerini yönetir
 */
export const formAPI = {
  /**
   * Yeni form oluştur (Korumalı endpoint)
   * @param {Object} data - Form verileri (title, description, fields, settings, theme)
   * @returns {Promise<Object>} Oluşturulan form
   */
  createForm: async (data) => {
    const response = await api.post('/forms', data)
    return response.data
  },

  /**
   * Kullanıcının tüm formlarını getir (Korumalı endpoint)
   * @returns {Promise<Object>} Kullanıcının formları
   */
  getUserForms: async () => {
    const response = await api.get('/forms')
    return response.data
  },

  /**
   * Belirli bir formu ID ile getir (Korumalı endpoint)
   * @param {string} id - Form ID
   * @returns {Promise<Object>} Form verisi
   */
  getForm: async (id) => {
    const response = await api.get(`/forms/id/${id}`)
    return response.data
  },

  /**
   * Formu güncelle (Korumalı endpoint)
   * @param {string} id - Form ID
   * @param {Object} data - Güncellenecek form verileri
   * @returns {Promise<Object>} Güncellenmiş form
   */
  updateForm: async (id, data) => {
    const response = await api.put(`/forms/${id}`, data)
    return response.data
  },

  /**
   * Formu sil (Korumalı endpoint)
   * @param {string} id - Form ID
   * @returns {Promise<Object>} Silme onayı
   */
  deleteForm: async (id) => {
    const response = await api.delete(`/forms/${id}`)
    return response.data
  },

  /**
   * Formu kopyala (Korumalı endpoint)
   * @param {string} id - Kopyalanacak form ID
   * @param {string} title - Yeni form başlığı (opsiyonel)
   * @returns {Promise<Object>} Kopyalanmış form
   */
  duplicateForm: async (id, title) => {
    const response = await api.post(`/forms/${id}/duplicate`, title ? { title } : {})
    return response.data
  },

  /**
   * Herkese açık formu slug ile getir (Kimlik doğrulama gerektirmez)
   * @param {string} slug - Form slug
   * @returns {Promise<Object>} Form verisi
   */
  getPublicForm: async (slug) => {
    const response = await api.get(`/forms/${slug}`)
    return response.data
  },

  /**
   * Form yanıtı gönder (Kimlik doğrulama gerektirmez)
   * @param {string} slug - Form slug
   * @param {Object} responses - Kullanıcı yanıtları
   * @returns {Promise<Object>} Gönderim onayı
   */
  submitForm: async (slug, responses) => {
    const response = await api.post(`/forms/${slug}/submit`, { responses })
    return response.data
  },

  /**
   * Form gönderimlerini getir (Korumalı endpoint)
   * @param {string} id - Form ID
   * @returns {Promise<Object>} Form gönderimleri
   */
  getFormSubmissions: async (id) => {
    const response = await api.get(`/forms/${id}/submissions`)
    return response.data
  },

  /**
   * Form istatistiklerini getir (Korumalı endpoint)
   * @param {string} id - Form ID
   * @returns {Promise<Object>} Form istatistikleri
   */
  getFormStats: async (id) => {
    const response = await api.get(`/forms/${id}/stats`)
    return response.data
  },

  /**
   * Form gönderimini sil (Korumalı endpoint)
   * @param {string} submissionId - Gönderim ID
   * @returns {Promise<Object>} Silme onayı
   */
  deleteSubmission: async (submissionId) => {
    const response = await api.delete(`/submissions/${submissionId}`)
    return response.data
  },
}

export default formAPI
