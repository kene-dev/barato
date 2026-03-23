import React, { useState } from 'react'
import call from '/src/assets/call.svg'
import cart from '/src/assets/cart.svg'
import { RiMenu3Line } from "react-icons/ri";
import logo from '../assets/logo.png';
import SearchBar from './SearchBar';
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useLocation } from 'react-router'
import { navigationLinks, Navlanguages } from '@/lib/navLinks'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCartItems } from '@/app/features/cartSlice'
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import SearchModal from './SearchBar';


function Header({ scrollY }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isScrolled = scrollY > 20;

  const cartItems = useSelector(selectCartItems) || [];
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
          }`}
      >
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b-2 border-primary">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
              <img src={logo} className="lg:w-24 w-18 object-contain" />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Home', 'Shop', 'About', 'FAQ', 'Contact'].map((item) => (
                <Link
                  to={`/${item === "Home" ? '' : item.toLowerCase()}`}
                  key={item}
                  whileHover={{ y: -2 }}
                  className="text-black hover:text-cyan-600 font-semibold uppercase text-sm tracking-wider transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="size-5" />
              </button>
              <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <ShoppingCart className="size-5" />
                <span className="absolute -top-1 -right-1 size-5 bg-primary rounded-full text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden border-l-4 border-black"
          >
            <div className="p-6">
              <nav className="flex flex-col gap-6 mt-16">
                {['Home', 'Shop', 'About', 'FAQ', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={`/${item === "Home" ? '' : item.toLowerCase()}`}
                    className="text-xl font-bold text-black hover:text-cyan-600 transition-colors uppercase tracking-wider"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Header