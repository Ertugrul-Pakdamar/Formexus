import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import formAPI from '../services/formApi'
import FormEditor from '../components/FormEditor'
import FormPreview from '../components/FormPreview'
import ThemeCustomizer from '../components/ThemeCustomizer'
import Toast from '../components/Toast'
import LanguageSwitcher from '../components/LanguageSwitcher'

/**
 * Form Oluşturucu/Düzenleyici Sayfası
 * Form oluşturma, düzenleme, önizleme ve yayınlama işlemlerini yönetir
 */
export default function FormBuilder() {
  const { id } = useParams() // URL'den form ID'sini al
  const navigate = useNavigate()
  const { t } = useLanguage() // Çeviri fonksiyonu
  
  // State yönetimi
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('edit') // 'edit', 'preview', veya 'theme'
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' })
  
  // Otomatik kaydetme için ref'ler
  const saveTimeoutRef = useRef(null)
  const isInitialMount = useRef(true)

  /**
   * Component ilk yüklendiğinde veya ID değiştiğinde çalışır
   * Mevcut formu yükler veya yeni form oluşturur
   */
  useEffect(() => {
    if (id) {
      loadForm()
    } else {
      // Yeni form için varsayılan değerler
      setForm({
        title: t('untitledForm'),
        description: '',
        fields: [],
        settings: {
          isPublished: false,
          acceptResponses: true,
          allowMultipleSubmits: false,
          requireLogin: false,
          showProgressBar: true,
          confirmationMessage: t('defaultConfirmationMessage'),
        },
        theme: {
          primaryColor: '#6366f1',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      })
    }
  }, [id])

  /**
   * Mevcut formu API'den yükler
   */
  const loadForm = async () => {
    try {
      setLoading(true)
      const data = await formAPI.getForm(id)
      setForm(data)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error loading form:', error)
      setToast({ isOpen: true, message: t('failedToLoad'), type: 'error' })
      navigate('/workspace')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Otomatik kaydetme efekti
   * Form değiştiğinde 1.5 saniye sonra otomatik kaydeder
   */
  useEffect(() => {
    // İlk yüklemede veya form yoksa çalışma
    if (!form || !id || isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Mevcut timeout'u temizle
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Yeni timeout ayarla (1.5 saniye hareketsizlikten sonra kaydet)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true)
        await formAPI.updateForm(id, form)
        setLastSaved(new Date())
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setSaving(false)
      }
    }, 1500)

    // Cleanup: component unmount olduğunda timeout'u temizle
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [form, id])

  /**
   * Manuel kaydetme fonksiyonu
   */
  const handleSave = async () => {
    try {
      setSaving(true)
      if (id) {
        // Mevcut formu güncelle
        await formAPI.updateForm(id, form)
        setLastSaved(new Date())
      } else {
        // Yeni form oluştur ve düzenleme sayfasına yönlendir
        const newForm = await formAPI.createForm(form)
        navigate(`/workspace/forms/${newForm.id}`, { replace: true })
        return
      }
      setToast({ isOpen: true, message: t('formSaved'), type: 'success' })
    } catch (error) {
      console.error('Error saving form:', error)
      setToast({ isOpen: true, message: t('failedToSave'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  /**
   * Form yayınlama/yayından kaldırma
   */
  const handlePublish = async () => {
    try {
      setSaving(true)
      const updatedForm = {
        ...form,
        settings: {
          ...form.settings,
          isPublished: !form.settings.isPublished,
        },
      }
      await formAPI.updateForm(id, updatedForm)
      setForm(updatedForm)
      setToast({ 
        isOpen: true, 
        message: updatedForm.settings.isPublished ? t('formPublished') : t('formUnpublished'),
        type: 'success' 
      })
    } catch (error) {
      console.error('Error publishing form:', error)
      setToast({ isOpen: true, message: t('failedToPublish'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // Yükleme durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loadingForm')}</p>
        </div>
      </div>
    )
  }

  // Form yüklenene kadar hiçbir şey gösterme
  if (!form) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Bar - Form başlığı ve işlem butonları */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Sol taraf - Geri butonu ve form başlığı */}
            <div className="flex items-center space-x-4">
              {/* Çalışma alanına dön */}
              <button
                onClick={() => navigate('/workspace')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="text-xl font-semibold border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
              />
              {form.settings?.isPublished && (
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  {t('published')}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <div className="text-sm text-gray-500">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    {t('saving')}
                  </span>
                ) : lastSaved ? (
                  <span>{t('saved')} {new Date(lastSaved).toLocaleTimeString()}</span>
                ) : null}
              </div>
              {id && (
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    form.settings?.isPublished
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } transition disabled:opacity-50`}
                >
                  {form.settings?.isPublished ? t('unpublish') : t('publish')}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-t">
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'edit'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('edit')}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'preview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('preview')}
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'theme'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('theme')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'edit' ? (
          <FormEditor form={form} onChange={setForm} />
        ) : activeTab === 'preview' ? (
          <FormPreview form={form} />
        ) : (
          <ThemeCustomizer form={form} onChange={setForm} />
        )}
      </div>

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
