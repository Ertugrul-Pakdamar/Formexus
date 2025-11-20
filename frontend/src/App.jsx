import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import Workspace from './pages/Workspace'
import FormBuilder from './pages/FormBuilder'
import FormResponses from './pages/FormResponses'
import PublicFormView from './pages/PublicFormView'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/workspace" 
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workspace/forms/:id" 
            element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workspace/forms/:id/responses" 
            element={
              <ProtectedRoute>
                <FormResponses />
              </ProtectedRoute>
            } 
          />
          <Route path="/f/:slug" element={<PublicFormView />} />
        </Routes>
      </Router>
    </AuthProvider>
    </LanguageProvider>
  )
}

export default App
