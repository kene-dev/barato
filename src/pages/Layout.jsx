import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa'

function Layout() {
  return (
    <div className='w-screen min-h-screen'>
      <Header />
      <Outlet />
      <Footer />
      
      <a
        href="https://wa.me/2348060119051?text=Hello!%20I%20would%20like%20to%20make%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#1EBE5D] transition-transform transform hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>
    </div>
  )
}

export default Layout