import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import Workspace from './pages/Workspace'
import FormBuilder from './pages/FormBuilder'
import FormResponses from './pages/FormResponses'
import PublicFormView from './pages/PublicFormView'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Ana uygulama bileşeni
 * Tüm sayfaların yönlendirmesini ve context provider'larını yönetir
 */
function App() {
  return (
    // Dil desteği sağlayan provider
    <LanguageProvider>
      {/* Kullanıcı kimlik doğrulaması sağlayan provider */}
      <AuthProvider>
        {/* Sayfa yönlendirme yapısı */}
        <Router>
          <Routes>
            {/* Ana sayfa */}
            <Route path="/" element={<Home />} />
            
            {/* Korumalı sayfa: Çalışma alanı */}
            <Route 
              path="/workspace" 
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              } 
            />
            
            {/* Korumalı sayfa: Form oluşturucu/düzenleyici */}
            <Route 
              path="/workspace/forms/:id" 
              element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              } 
            />
            
            {/* Korumalı sayfa: Form yanıtları */}
            <Route 
              path="/workspace/forms/:id/responses" 
              element={
                <ProtectedRoute>
                  <FormResponses />
                </ProtectedRoute>
              } 
            />
            
            {/* Herkese açık: Form görüntüleme ve doldurma */}
            <Route path="/f/:slug" element={<PublicFormView />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
