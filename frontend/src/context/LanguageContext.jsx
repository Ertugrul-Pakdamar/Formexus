import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Navigation & Common
    welcome: 'Welcome',
    logout: 'Logout',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    preview: 'Preview',
    theme: 'Theme',
    duplicate: 'Duplicate',
    copyLink: 'Copy link',
    
    // Workspace
    workspace: 'Workspace',
    createNewForm: 'Create a New Form',
    chooseTemplate: 'Choose a template or start from scratch',
    myForms: 'My Forms',
    all: 'All',
    published: 'Published',
    draft: 'Draft',
    noFormsYet: 'No forms yet',
    noPublishedForms: 'No published forms',
    noDraftForms: 'No draft forms',
    createFirstForm: 'Create your first form to get started',
    noDraftFormsDesc: "You don't have any draft forms yet",
    noPublishedFormsDesc: "You don't have any published forms yet",
    createYourFirstForm: 'Create Your First Form',
    
    // Templates
    blankForm: 'Blank Form',
    blankFormDesc: 'Start from scratch',
    contactForm: 'Contact Form',
    contactFormDesc: 'Collect contact information',
    survey: 'Survey',
    surveyDesc: 'Gather feedback and opinions',
    registration: 'Registration',
    registrationDesc: 'Event or course registration',
    quiz: 'Quiz',
    quizDesc: 'Create tests and quizzes',
    feedback: 'Feedback',
    feedbackDesc: 'Customer feedback form',
    
    // Form Builder
    untitledForm: 'Untitled Form',
    publish: 'Publish',
    unpublish: 'Unpublish',
    formPublished: 'Form published!',
    formUnpublished: 'Form unpublished',
    formSaved: 'Form saved successfully!',
    failedToSave: 'Failed to save form',
    failedToPublish: 'Failed to publish form',
    failedToLoad: 'Failed to load form',
    loadingForm: 'Loading form...',
    
    // Form Responses
    responses: 'Responses',
    noResponses: 'No responses yet',
    shareFormToCollect: 'Share your form to start collecting responses',
    exportCSV: 'Export CSV',
    date: 'Date',
    loadingResponses: 'Loading responses...',
    failedToLoadResponses: 'Failed to load responses',
    formLinkCopied: 'Form link copied!',
    editForm: 'Edit Form',
    
    // Theme Customizer
    themeCustomization: 'Theme Customization',
    primaryColor: 'Primary Color',
    backgroundColor: 'Background Color',
    previewTheme: 'Preview',
    sampleButton: 'Sample Button',
    
    // Colors
    purple: 'Purple',
    blue: 'Blue',
    green: 'Green',
    pink: 'Pink',
    indigo: 'Indigo',
    orange: 'Orange',
    white: 'White',
    lightGray: 'Light Gray',
    lightBlue: 'Light Blue',
    lightPurple: 'Light Purple',
    lightPink: 'Light Pink',
    
    // Dialog & Toast
    confirmDelete: 'Delete Form',
    confirmDeleteMsg: 'Are you sure you want to delete this form? This action cannot be undone.',
    formDeleted: 'Form deleted successfully',
    failedToDelete: 'Failed to delete form',
    formDuplicated: 'Form duplicated successfully',
    failedToDuplicate: 'Failed to duplicate form',
    linkCopied: 'Link copied to clipboard!',
    failedToCreate: 'Failed to create form',
    
    // Public Form View
    formNotFound: 'Form not found',
    formNotAvailable: 'This form may have been deleted or is not available.',
    thankYou: 'Thank You!',
    submissionReceived: 'Your response has been recorded.',
    submit: 'Submit',
    submitting: 'Submitting...',
    requiredField: 'This field is required',
    fillRequired: 'Please fill in all required fields',
    failedToSubmit: 'Failed to submit form',
    poweredBy: 'Powered by',
  },
  tr: {
    // Navigation & Common
    welcome: 'Hoş geldiniz',
    logout: 'Çıkış',
    save: 'Kaydet',
    saving: 'Kaydediliyor...',
    saved: 'Kaydedildi',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    preview: 'Önizleme',
    theme: 'Tema',
    duplicate: 'Çoğalt',
    copyLink: 'Linki kopyala',
    
    // Workspace
    workspace: 'Çalışma Alanı',
    createNewForm: 'Yeni Form Oluştur',
    chooseTemplate: 'Bir şablon seç veya sıfırdan başla',
    myForms: 'Formlarım',
    all: 'Tümü',
    published: 'Yayında',
    draft: 'Taslak',
    noFormsYet: 'Henüz form yok',
    noPublishedForms: 'Yayında form yok',
    noDraftForms: 'Taslak form yok',
    createFirstForm: 'Başlamak için ilk formunuzu oluşturun',
    noDraftFormsDesc: 'Henüz taslak formunuz yok',
    noPublishedFormsDesc: 'Henüz yayında formunuz yok',
    createYourFirstForm: 'İlk Formunuzu Oluşturun',
    
    // Templates
    blankForm: 'Boş Form',
    blankFormDesc: 'Sıfırdan başla',
    contactForm: 'İletişim Formu',
    contactFormDesc: 'İletişim bilgilerini topla',
    survey: 'Anket',
    surveyDesc: 'Geri bildirim ve görüş topla',
    registration: 'Kayıt Formu',
    registrationDesc: 'Etkinlik veya kurs kaydı',
    quiz: 'Quiz',
    quizDesc: 'Test ve sınav oluştur',
    feedback: 'Geri Bildirim',
    feedbackDesc: 'Müşteri geri bildirim formu',
    
    // Form Builder
    untitledForm: 'İsimsiz Form',
    publish: 'Yayınla',
    unpublish: 'Yayından Kaldır',
    formPublished: 'Form yayınlandı!',
    formUnpublished: 'Form yayından kaldırıldı',
    formSaved: 'Form başarıyla kaydedildi!',
    failedToSave: 'Form kaydedilemedi',
    failedToPublish: 'Form yayınlanamadı',
    failedToLoad: 'Form yüklenemedi',
    loadingForm: 'Form yükleniyor...',
    
    // Form Responses
    responses: 'Cevaplar',
    noResponses: 'Henüz cevap yok',
    shareFormToCollect: 'Cevap toplamaya başlamak için formunuzu paylaşın',
    exportCSV: 'CSV İndir',
    date: 'Tarih',
    loadingResponses: 'Cevaplar yükleniyor...',
    failedToLoadResponses: 'Cevaplar yüklenemedi',
    formLinkCopied: 'Form linki kopyalandı!',
    editForm: 'Formu Düzenle',
    
    // Theme Customizer
    themeCustomization: 'Tema Özelleştirme',
    primaryColor: 'Ana Renk',
    backgroundColor: 'Arka Plan Rengi',
    previewTheme: 'Önizleme',
    sampleButton: 'Örnek Buton',
    
    // Colors
    purple: 'Mor',
    blue: 'Mavi',
    green: 'Yeşil',
    pink: 'Pembe',
    indigo: 'Çivit Mavisi',
    orange: 'Turuncu',
    white: 'Beyaz',
    lightGray: 'Açık Gri',
    lightBlue: 'Açık Mavi',
    lightPurple: 'Açık Mor',
    lightPink: 'Açık Pembe',
    
    // Dialog & Toast
    confirmDelete: 'Formu Sil',
    confirmDeleteMsg: 'Bu formu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    formDeleted: 'Form başarıyla silindi',
    failedToDelete: 'Form silinemedi',
    formDuplicated: 'Form başarıyla çoğaltıldı',
    failedToDuplicate: 'Form çoğaltılamadı',
    linkCopied: 'Link panoya kopyalandı!',
    failedToCreate: 'Form oluşturulamadı',
    
    // Public Form View
    formNotFound: 'Form bulunamadı',
    formNotAvailable: 'Bu form silinmiş olabilir veya mevcut değil.',
    thankYou: 'Teşekkürler!',
    submissionReceived: 'Cevabınız kaydedildi.',
    submit: 'Gönder',
    submitting: 'Gönderiliyor...',
    requiredField: 'Bu alan zorunludur',
    fillRequired: 'Lütfen tüm zorunlu alanları doldurun',
    failedToSubmit: 'Form gönderilemedi',
    poweredBy: 'Destekleyen',
  },
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    return translations[language][key] || key
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
