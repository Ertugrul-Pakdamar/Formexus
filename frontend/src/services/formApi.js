import api from './api'

export const formAPI = {
  // Form CRUD operations (protected)
  createForm: async (data) => {
    const response = await api.post('/forms', data)
    return response.data
  },

  getUserForms: async () => {
    const response = await api.get('/forms')
    return response.data
  },

  getForm: async (id) => {
    const response = await api.get(`/forms/id/${id}`)
    return response.data
  },

  updateForm: async (id, data) => {
    const response = await api.put(`/forms/${id}`, data)
    return response.data
  },

  deleteForm: async (id) => {
    const response = await api.delete(`/forms/${id}`)
    return response.data
  },

  duplicateForm: async (id, title) => {
    const response = await api.post(`/forms/${id}/duplicate`, title ? { title } : {})
    return response.data
  },

  // Public form operations (no auth required)
  getPublicForm: async (slug) => {
    const response = await api.get(`/forms/${slug}`)
    return response.data
  },

  submitForm: async (slug, responses) => {
    const response = await api.post(`/forms/${slug}/submit`, { responses })
    return response.data
  },

  // Submissions and stats (protected)
  getFormSubmissions: async (id) => {
    const response = await api.get(`/forms/${id}/submissions`)
    return response.data
  },

  getFormStats: async (id) => {
    const response = await api.get(`/forms/${id}/stats`)
    return response.data
  },

  deleteSubmission: async (submissionId) => {
    const response = await api.delete(`/submissions/${submissionId}`)
    return response.data
  },
}

export default formAPI
