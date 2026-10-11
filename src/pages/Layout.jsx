import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa'

function Layout() {
  return (
    <div className='min-h-screen w-full overflow-x-clip'>
      <Header />
      <Outlet />
      <Footer />
      
      <a
        href="https://wa.me/2348060119051?text=Hello!%20I%20would%20like%20to%20make%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-5 bottom-5 z-50 grid size-12 place-items-center rounded-full border-2 border-white bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#30251f] sm:right-6 sm:bottom-6"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  )
}

export default Layout
