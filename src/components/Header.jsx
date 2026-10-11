import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { selectCartItems } from '@/app/features/cartSlice'
import SearchModal from './SearchBar'
import logo from '../assets/logo.png'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Sales', to: '/sales' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()
  const cartItems = useSelector(selectCartItems) || []
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e6d9cb] bg-[#faf7f2]/95 text-[#30251f] backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1450px] items-center justify-between gap-4 px-5 lg:px-10">
          <Link to="/" aria-label="Matrix Scents home" onClick={() => setMobileMenuOpen(false)} className="flex min-w-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a33075]">
            <img src={logo} alt="" className="size-10 shrink-0 object-contain sm:size-11" />
            <span className="text-sm leading-[1.1] font-semibold tracking-[.08em] uppercase sm:text-base">Matrix<br />Scents</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden h-full items-center gap-1 lg:flex">
            {links.map(link => {
              const active = pathname === link.to || (link.to === '/shop' && pathname.startsWith('/shop/'))
              return <Link key={link.to} to={link.to} aria-current={active ? 'page' : undefined} className={`relative flex h-full items-center px-4 text-[11px] font-semibold tracking-[.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-[#a33075] ${active ? 'text-[#a33075] after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-[#a33075]' : 'hover:text-[#a33075]'}`}>{link.label}</Link>
            })}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button type="button" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true) }} aria-label="Search products" className="grid size-10 place-items-center transition-colors hover:bg-[#eee5db] focus-visible:outline-2 focus-visible:outline-[#a33075]"><Search size={20} strokeWidth={1.7} /></button>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} aria-label={`Cart, ${cartCount} items`} className="relative grid size-10 place-items-center transition-colors hover:bg-[#eee5db] focus-visible:outline-2 focus-visible:outline-[#a33075]">
              <ShoppingBag size={20} strokeWidth={1.7} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-5 h-5 place-items-center rounded-full bg-[#a33075] px-1 text-[10px] font-semibold text-white">{cartCount}</span>}
            </Link>
            <button type="button" onClick={() => setMobileMenuOpen(open => !open)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" className="grid size-10 place-items-center transition-colors hover:bg-[#eee5db] focus-visible:outline-2 focus-visible:outline-[#a33075] lg:hidden">{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="fixed inset-x-0 top-20 z-40 border-b border-[#e6d9cb] bg-[#faf7f2] px-5 py-5 shadow-xl lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-[1450px] flex-col">
            {links.map(link => <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} aria-current={pathname === link.to ? 'page' : undefined} className={`border-b border-[#e6d9cb] py-3 text-2xl tracking-[-.035em] last:border-b-0 focus-visible:outline-2 focus-visible:outline-[#a33075] [font-family:Georgia,'Times_New_Roman',serif] ${pathname === link.to ? 'text-[#a33075]' : ''}`}>{link.label}</Link>)}
          </nav>
        </div>
      )}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

export default Header
