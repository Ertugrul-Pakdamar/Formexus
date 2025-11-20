import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import formAPI from '../services/formApi'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import LanguageSwitcher from '../components/LanguageSwitcher'

function Workspace() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'published', 'draft'
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, formId: null })
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' })

  const templates = [
    {
      id: 1,
      name: 'Blank Form',
      nameKey: 'blankForm',
      description: 'Start from scratch',
      descKey: 'blankFormDesc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      color: 'bg-purple-50',
      fields: []
    },
    {
      id: 2,
      name: 'Contact Form',
      nameKey: 'contactForm',
      description: 'Collect contact information',
      descKey: 'contactFormDesc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'bg-blue-50',
      fields: [
        { id: '1', type: 'short_text', label: 'Full Name', required: true },
        { id: '2', type: 'email', label: 'Email Address', required: true },
        { id: '3', type: 'phone', label: 'Phone Number', required: false },
        { id: '4', type: 'long_text', label: 'Message', required: true }
      ]
    },
    {
      id: 3,
      name: 'Survey',
      nameKey: 'survey',
      description: 'Gather feedback and opinions',
      descKey: 'surveyDesc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      color: 'bg-green-50',
      fields: [
        { id: '1', type: 'section', label: 'Customer Satisfaction Survey', description: 'Help us improve our service' },
        { id: '2', type: 'rating', label: 'Overall Satisfaction', required: true, maxValue: 5 },
        { id: '3', type: 'single_choice', label: 'How often do you use our service?', required: true, options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
        { id: '4', type: 'multi_choice', label: 'What features do you use?', options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'] },
        { id: '5', type: 'long_text', label: 'Additional Comments', required: false }
      ]
    },
    {
      id: 4,
      name: 'Registration',
      nameKey: 'registration',
      description: 'Event or course registration',
      descKey: 'registrationDesc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
      color: 'bg-orange-50',
      fields: [
        { id: '1', type: 'section', label: 'Event Registration', description: 'Please fill in your details' },
        { id: '2', type: 'short_text', label: 'Full Name', required: true },
        { id: '3', type: 'email', label: 'Email', required: true },
        { id: '4', type: 'phone', label: 'Phone Number', required: true },
        { id: '5', type: 'dropdown', label: 'T-Shirt Size', required: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        { id: '6', type: 'multi_choice', label: 'Dietary Restrictions', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'] }
      ]
    },
    {
      id: 5,
      name: 'Quiz',
      nameKey: 'quiz',
      description: 'Create tests and quizzes',
      descKey: 'quizDesc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      color: 'bg-pink-50',
      fields: [
        { id: '1', type: 'section', label: 'General Knowledge Quiz', description: 'Test your knowledge' },
        { id: '2', type: 'single_choice', label: 'What is the capital of France?', required: true, options: ['London', 'Paris', 'Berlin', 'Madrid'] },
        { id: '3', type: 'single_choice', label: 'Which planet is closest to the Sun?', required: true, options: ['Venus', 'Mercury', 'Mars', 'Earth'] },
        { id: '4', type: 'multi_choice', label: 'Select all programming languages', required: true, options: ['Python', 'HTML', 'JavaScript', 'CSS', 'Java'] },
        { id: '5', type: 'short_text', label: 'What is 2 + 2?', required: true }
      ]
    },
    {
      id: 6,
      name: 'Feedback',
      nameKey: 'feedback',
      description: 'Customer feedback form',
      descKey: 'feedbackDesc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      color: 'bg-indigo-50',
      fields: [
        { id: '1', type: 'section', label: 'We Value Your Feedback', description: 'Tell us what you think' },
        { id: '2', type: 'linear_scale', label: 'How likely are you to recommend us?', required: true, minValue: 1, maxValue: 10, minLabel: 'Not likely', maxLabel: 'Very likely' },
        { id: '3', type: 'rating', label: 'Product Quality', required: true, maxValue: 5 },
        { id: '4', type: 'rating', label: 'Customer Service', required: true, maxValue: 5 },
        { id: '5', type: 'long_text', label: 'What can we improve?', required: false }
      ]
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      const data = await formAPI.getUserForms()
      setForms(data.forms || [])
    } catch (error) {
      console.error('Error loading forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewForm = async (template) => {
    try {
      const newForm = await formAPI.createForm({
        title: template?.name || 'Untitled Form',
        description: '',
        fields: template?.fields || [],
      })
      navigate(`/workspace/forms/${newForm.id}`)
    } catch (error) {
      console.error('Error creating form:', error)
      setToast({ isOpen: true, message: 'Failed to create form', type: 'error' })
    }
  }

  const deleteForm = async () => {
    try {
      await formAPI.deleteForm(confirmDialog.formId)
      setForms(forms.filter((f) => f.id !== confirmDialog.formId))
      setToast({ isOpen: true, message: 'Form deleted successfully', type: 'success' })
    } catch (error) {
      console.error('Error deleting form:', error)
      setToast({ isOpen: true, message: 'Failed to delete form', type: 'error' })
    }
  }

  const duplicateForm = async (id) => {
    try {
      const duplicated = await formAPI.duplicateForm(id)
      setForms([duplicated, ...forms])
      setToast({ isOpen: true, message: 'Form duplicated successfully', type: 'success' })
    } catch (error) {
      console.error('Error duplicating form:', error)
      setToast({ isOpen: true, message: 'Failed to duplicate form', type: 'error' })
    }
  }

  const filteredForms = forms.filter((form) => {
    if (filter === 'published') return form.isPublished
    if (filter === 'draft') return !form.isPublished
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-purple-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-800 tracking-tight">Formexus</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <span className="text-gray-600">{t('welcome')}, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Form Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('createNewForm')}</h2>
            <p className="text-gray-600">{t('chooseTemplate')}</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => createNewForm(template)}
                className={`${template.color} p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer`}
              >
                <div className="text-purple-600 mb-3">{template.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{t(template.nameKey)}</h3>
                <p className="text-sm text-gray-600">{t(template.descKey)}</p>
              </button>
            ))}
          </div>
        </section>

        {/* My Forms Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Forms</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  filter === 'all' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({forms.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  filter === 'published' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Published ({forms.filter((f) => f.isPublished).length})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  filter === 'draft' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Draft ({forms.filter((f) => !f.isPublished).length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading forms...</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No forms yet' : `No ${filter} forms`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Create your first form to get started'
                  : `You don't have any ${filter} forms yet`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => createNewForm()}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Create Your First Form
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {form.title}
                        </h3>
                        {form.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                        )}
                      </div>
                      {form.isPublished ? (
                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {form.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {form.submitCount}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/workspace/forms/${form.id}`)}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/workspace/forms/${form.id}/responses`)}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition"
                        title="View responses"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </button>
                      <button
                        onClick={() => window.open(`/f/${form.slug}`, '_blank')}
                        disabled={!form.isPublished}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition disabled:opacity-50"
                        title="View form"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      <div className="relative group">
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <button
                            onClick={() => duplicateForm(form.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`)
                              setToast({ isOpen: true, message: 'Link copied to clipboard!', type: 'success' })
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Copy link
                          </button>
                          <button
                            onClick={() => setConfirmDialog({ isOpen: true, formId: form.id })}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, formId: null })}
        onConfirm={deleteForm}
        title="Delete Form"
        message="Are you sure you want to delete this form? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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

export default Workspace
