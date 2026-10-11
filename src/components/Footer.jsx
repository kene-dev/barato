import { Link } from 'react-router'
import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react'
import logo from '../assets/logo.png'

const shopLinks = [
  { label: 'All fragrances', to: '/shop' },
  { label: 'About Matrix Scents', to: '/about' },
  { label: 'Your cart', to: '/cart' },
]

const helpLinks = [
  { label: 'Contact us', to: '/contact' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Returns & refunds', to: '/returns-refunds' },
]

function Footer() {
  return (
    <footer className="bg-[#30251f] text-[#f9f5ef]">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8 lg:px-10 lg:pt-20">
        <div className="grid gap-12 border-b border-white/20 pb-14 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div>
            <p className="mb-5 text-[11px] font-semibold tracking-[.24em] uppercase text-[#f3a7d9]">The Matrix Scents edit</p>
            <h2 className="max-w-md text-4xl leading-[1.04] tracking-[-.05em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Find something that feels like <em className="font-normal text-[#f3a7d9]">you.</em></h2>
            <Link to="/shop" className="mt-8 inline-flex min-h-11 items-center gap-4 border-b border-[#f3a7d9] pb-1 text-sm font-medium transition-colors hover:text-[#f3a7d9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]">
              Explore the collection <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <nav aria-label="Shop links">
            <h3 className="mb-5 text-[11px] font-semibold tracking-[.2em] uppercase text-[#d3bbb2]">Explore</h3>
            <ul className="space-y-3">
              {shopLinks.map(link => <li key={link.to}><Link to={link.to} className="text-sm text-[#f9f5ef]/85 transition-colors hover:text-[#f3a7d9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]">{link.label}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Support links">
            <h3 className="mb-5 text-[11px] font-semibold tracking-[.2em] uppercase text-[#d3bbb2]">Here to help</h3>
            <ul className="space-y-3">
              {helpLinks.map(link => <li key={link.to}><Link to={link.to} className="text-sm text-[#f9f5ef]/85 transition-colors hover:text-[#f3a7d9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]">{link.label}</Link></li>)}
            </ul>
            <a href="https://wa.me/2348060119051" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-[#f3a7d9] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]"><MessageCircle size={17} /> Chat on WhatsApp</a>
          </nav>
        </div>
        <div className="flex flex-col gap-5 pt-7 text-xs text-[#d3bbb2] sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" aria-label="Matrix Scents home" className="inline-flex w-max items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]"><img src={logo} alt="" className="size-10 bg-white object-contain p-1" /><span className="text-sm font-semibold tracking-[.08em] uppercase text-white">Matrix Scents</span></Link>
          <p>© {new Date().getFullYear()} Matrix Scents. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="text-xs text-[#f9f5ef]/85 hover:text-[#f3a7d9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]">Get in touch ↗</Link>
            <a href="https://www.instagram.com/matrix_scents" target="_blank" rel="noopener noreferrer" aria-label="Matrix Scents on Instagram" className="text-[#f9f5ef]/85 hover:text-[#f3a7d9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3a7d9]"><Instagram size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
