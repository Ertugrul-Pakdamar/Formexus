import { useState } from 'react'
import LoginModal from './LoginModal'

function CTA() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <section className="py-20 px-4 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of users who trust Formexus for their form needs.
          </p>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Create Your First Form
          </button>
        </div>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

export default CTA
