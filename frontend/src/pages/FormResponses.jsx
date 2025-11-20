import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import formAPI from '../services/formApi'
import Toast from '../components/Toast'

export default function FormResponses() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [formData, submissionsData] = await Promise.all([
        formAPI.getForm(id),
        formAPI.getFormSubmissions(id)
      ])
      setForm(formData)
      setSubmissions(submissionsData.submissions || [])
    } catch (error) {
      console.error('Error loading data:', error)
      setToast({ isOpen: true, message: 'Failed to load responses', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!submissions.length) return

    const headers = form.fields.filter(f => f.type !== 'section').map(f => f.label)
    const csvHeaders = ['Submission Date', ...headers].join(',')
    
    const csvRows = submissions.map(sub => {
      const date = new Date(sub.submittedAt).toLocaleString()
      const values = form.fields
        .filter(f => f.type !== 'section')
        .map(field => {
          const value = sub.responses[field.id]
          if (Array.isArray(value)) return `"${value.join(', ')}"`
          return `"${value || ''}"`
        })
      return [date, ...values].join(',')
    })

    const csv = [csvHeaders, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title}-responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading responses...</p>
        </div>
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/workspace')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{form.title}</h1>
                <p className="text-sm text-gray-500">{submissions.length} responses</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/workspace/forms/${id}`)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                Edit Form
              </button>
              <button
                onClick={exportToCSV}
                disabled={!submissions.length}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600 mb-6">
              Share your form to start collecting responses
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`)
                setToast({ isOpen: true, message: 'Form link copied!', type: 'success' })
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Copy Form Link
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    {form.fields.filter(f => f.type !== 'section').map(field => (
                      <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission, idx) => (
                    <tr key={submission.id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </td>
                      {form.fields.filter(f => f.type !== 'section').map(field => {
                        const value = submission.responses[field.id]
                        let displayValue = value

                        if (Array.isArray(value)) {
                          displayValue = value.join(', ')
                        } else if (typeof value === 'boolean') {
                          displayValue = value ? 'Yes' : 'No'
                        } else if (!value) {
                          displayValue = '-'
                        }

                        return (
                          <td key={field.id} className="px-6 py-4 text-sm text-gray-700">
                            <div className="max-w-xs truncate" title={displayValue}>
                              {displayValue}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  )
}
