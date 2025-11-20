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
    formNotFoundOrUnavailable: 'Form not found or not available',
    formDeletedOrUnavailable: 'This form may have been deleted or is not available.',
    thankYou: 'Thank You!',
    submissionReceived: 'Your response has been recorded.',
    responseRecorded: 'Your response has been recorded.',
    submit: 'Submit',
    submitting: 'Submitting...',
    requiredField: 'This field is required',
    fieldRequired: 'This field is required',
    fillRequired: 'Please fill in all required fields',
    fillAllRequired: 'Please fill in all required fields',
    failedToSubmit: 'Failed to submit form',
    poweredBy: 'Powered by',
    continue: 'Continue',
    of: 'of',
    answered: 'answered',
    yourAnswer: 'Your answer',
    selectOption: 'Select an option',
    
    // Landing Page
    welcomeTo: 'Welcome to',
    heroDescription: 'Create beautiful, intelligent forms in minutes. Collect responses, analyze data, and make informed decisions with our powerful form builder platform.',
    createForm: 'Create a Form',
    buildFormsThat: 'Build Forms That',
    workForYou: 'Work For You',
    dragDropBuilder: 'Drag & Drop Builder',
    dragDropBuilderDesc: 'Create stunning forms with our intuitive drag-and-drop interface. No coding required.',
    realTimeAnalytics: 'Real-Time Analytics',
    realTimeAnalyticsDesc: 'Track responses in real-time with powerful analytics and beautiful visualizations.',
    secureReliable: 'Secure & Reliable',
    secureReliableDesc: 'Enterprise-grade security to keep your data safe and compliant with regulations.',
    howIt: 'How It',
    works: 'Works',
    chooseTemplateStep: 'Choose a Template',
    chooseTemplateStepDesc: 'Start with one of our professionally designed templates or build from scratch. Customize everything to match your brand.',
    addQuestions: 'Add Your Questions',
    addQuestionsDesc: 'Use multiple question types: text, multiple choice, checkboxes, dropdowns, file uploads, and more. Add logic and branching for smart forms.',
    shareCollect: 'Share & Collect',
    shareCollectDesc: 'Share your form via link, email, or embed it on your website. Start collecting responses instantly and watch your data come to life.',
    readyToStart: 'Ready to Get Started?',
    joinThousands: 'Join thousands of users who trust Formexus for their form needs.',
    allRightsReserved: 'All rights reserved.',
    
    // Login Modal
    welcomeBack: 'Welcome back!',
    createAccount: 'Create Account',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    emailAddress: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    processing: 'Processing...',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    
    // Form Editor
    description: 'Description',
    addDescription: 'Add a description for your form...',
    addField: 'Add Field',
    formSettings: 'Form Settings',
    allowMultipleSubmissions: 'Allow multiple submissions',
    requireLogin: 'Require login to submit',
    showProgressBar: 'Show progress bar',
    confirmationMessage: 'Confirmation Message',
    defaultConfirmationMessage: 'Thank you for your submission!',
    previewMode: 'Preview Mode',
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
    formNotFoundOrUnavailable: 'Form bulunamadı veya mevcut değil',
    formDeletedOrUnavailable: 'Bu form silinmiş olabilir veya mevcut değil.',
    thankYou: 'Teşekkürler!',
    submissionReceived: 'Cevabınız kaydedildi.',
    responseRecorded: 'Cevabınız kaydedildi.',
    submit: 'Gönder',
    submitting: 'Gönderiliyor...',
    requiredField: 'Bu alan zorunludur',
    fieldRequired: 'Bu alan zorunludur',
    fillRequired: 'Lütfen tüm zorunlu alanları doldurun',
    fillAllRequired: 'Lütfen tüm zorunlu alanları doldurun',
    failedToSubmit: 'Form gönderilemedi',
    poweredBy: 'Destekleyen',
    continue: 'Devam Et',
    of: '/',
    answered: 'cevaplandı',
    yourAnswer: 'Cevabınız',
    selectOption: 'Bir seçenek seçin',
    
    // Landing Page
    welcomeTo: 'Hoş geldiniz',
    heroDescription: 'Dakikalar içinde güzel ve akıllı formlar oluşturun. Cevapları toplayın, verileri analiz edin ve güçlü form oluşturucu platformumuzla bilinçli kararlar alın.',
    createForm: 'Form Oluştur',
    buildFormsThat: 'Size Uygun',
    workForYou: 'Formlar Oluşturun',
    dragDropBuilder: 'Sürükle & Bırak Oluşturucu',
    dragDropBuilderDesc: 'Sezgisel sürükle-bırak arayüzümüzle etkileyici formlar oluşturun. Kodlama gerekmez.',
    realTimeAnalytics: 'Gerçek Zamanlı Analitik',
    realTimeAnalyticsDesc: 'Güçlü analizler ve güzel görselleştirmelerle cevapları gerçek zamanlı takip edin.',
    secureReliable: 'Güvenli & Güvenilir',
    secureReliableDesc: 'Verilerinizi güvende tutmak ve düzenlemelere uyum sağlamak için kurumsal düzeyde güvenlik.',
    howIt: 'Nasıl',
    works: 'Çalışır',
    chooseTemplateStep: 'Şablon Seçin',
    chooseTemplateStepDesc: 'Profesyonel olarak tasarlanmış şablonlarımızdan biriyle başlayın veya sıfırdan oluşturun. Her şeyi markanıza uyacak şekilde özelleştirin.',
    addQuestions: 'Sorularınızı Ekleyin',
    addQuestionsDesc: 'Birden fazla soru türü kullanın: metin, çoktan seçmeli, onay kutuları, açılır menüler, dosya yüklemeleri ve daha fazlası. Akıllı formlar için mantık ve dallanma ekleyin.',
    shareCollect: 'Paylaşın & Toplayın',
    shareCollectDesc: 'Formunuzu link, e-posta yoluyla paylaşın veya web sitenize gömün. Anında cevap toplamaya başlayın ve verilerinizin canlanmasını izleyin.',
    readyToStart: 'Başlamaya Hazır mısınız?',
    joinThousands: 'Form ihtiyaçları için Formexus\'a güvenen binlerce kullanıcıya katılın.',
    allRightsReserved: 'Tüm hakları saklıdır.',
    
    // Login Modal
    welcomeBack: 'Tekrar hoş geldiniz!',
    createAccount: 'Hesap Oluştur',
    fullName: 'Ad Soyad',
    fullNamePlaceholder: 'Ahmet Yılmaz',
    emailAddress: 'E-posta Adresi',
    emailPlaceholder: 'ornek@email.com',
    password: 'Şifre',
    confirmPassword: 'Şifreyi Onayla',
    rememberMe: 'Beni hatırla',
    processing: 'İşleniyor...',
    signIn: 'Giriş Yap',
    signUp: 'Kayıt Ol',
    noAccount: 'Hesabınız yok mu?',
    haveAccount: 'Zaten hesabınız var mı?',
    
    // Form Editor
    description: 'Açıklama',
    addDescription: 'Formunuz için bir açıklama ekleyin...',
    addField: 'Alan Ekle',
    formSettings: 'Form Ayarları',
    allowMultipleSubmissions: 'Birden fazla gönderime izin ver',
    requireLogin: 'Göndermek için giriş gerektir',
    showProgressBar: 'İlerleme çubuğunu göster',
    confirmationMessage: 'Onay Mesajı',
    defaultConfirmationMessage: 'Gönderiminiz için teşekkürler!',
    previewMode: 'Önizleme Modu',
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
