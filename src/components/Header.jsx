import React, { useState } from 'react'
import call from '/src/assets/call.svg'
import search from '/src/assets/search.svg'
import cart from '/src/assets/cart.svg'
import { FiSearch } from "react-icons/fi";
import { RiMenu3Line } from "react-icons/ri";
import logo from '../assets/logo.png';
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


function Header() {
  const [openMenu, setOpenMenu] = useState(false)
  const location = useLocation()
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const cartLength = useSelector(selectCartItems)

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className='w-screen font-poppins' >
       {/* first section bg-white*/}
      <div className='bg-[#F2F2F5] h-[45px] w-full flex justify-between items-center px-10 text-[13px]'>
        <div className='hidden lg:flex justify-center items-center gap-3 '>
          <img src={call} alt="" />
          <p>CALL US:</p>
          <p>+234 806 011 9051</p>
        </div>
        <div className='flex justify-between items-center gap-8'>
          <p>NGN</p>

          {/* LANGUAGES DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-2 py-1">
                {Navlanguages.find(l => l.value === i18n.language)?.label || 'Language'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[120px] shadow-lg">
              {Navlanguages.map((item, index) => (
                <div key={item.value}>
                  <DropdownMenuItem
                    onSelect={() => handleLanguageChange(item.value)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                  >
                    <span className="text-sm font-medium text-black">{item.label}</span>
                  </DropdownMenuItem>
                  {index !== Navlanguages.length - 1 && <DropdownMenuSeparator />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        
        </div>
      </div>

      {/* second section bg-red */}
      <div className="bg-primary/10 lg:h-[127px] h-[80px] w-full flex justify-between items-center px-10">
        <div className="flex flex-col">
          <img src={logo} className="lg:w-36 w-24 object-contain" />
          {/* <p className="lg:text-xs text-[10px] text-primary">{t('slogan')}</p> */}
        </div>

        <div className="h-[50px] hidden lg:flex items-center justify-center">
          <input
            type="text"
            placeholder={`${t('search products')}...`}
            className="pl-4 border-y border-l w-[600px] rounded-l-lg border-primary text-primary h-full placeholder-primary/40 placeholder:text-xs focus:outline-none bg-white"
          />
          <button className="bg-primary text-white flex items-center justify-center rounded-r-lg h-full gap-3 px-6 text-sm">
            <img src={search} alt="" className="w-4 h-4" />
            {t('search')}
          </button>
        </div>

        <div className="flex text-primary gap-3">
          <div className="relative">
            <Link to="/cart">
              <img src={cart} alt="" className="lg:w-9 lg:h-9 w-7 h-7" />
            </Link>
            <p
              data-test="cart-length"
              className="absolute bg-primary text-white text-xs -top-3 lg:-right-2 -right-3 px-2 py-1 rounded-full border-2 border-white"
            >
              {cartLength.length}
            </p>
          </div>
          <div className="hidden lg:flex flex-col text-sm">
            <Link to="/cart" className="text-primary">{t('cart')}</Link>
            <p className="text-sm text-primary/80">₦0.00 NGN</p>
          </div>
        </div>
      </div>

      {/* third section bg-tertiary */}

      <div className='w-full bg-primary h-[51px] lg:px-10 px-5 flex items-center lg:justify-normal justify-between lg:gap-30'>
        <div className='bg-[#F2F2F5] w-[300px] hidden lg:flex items-center justify-center font-semibold text-lg h-full'>
          ALL DEPARTMENTS
        </div>

        <div className='h-[40px] w-2/3  lg:hidden flex items-center justify-start relative'>
            <input type="text" placeholder='Search products..' className='pl-4 w-full rounded-lg bg-white text-black h-full placeholder-black/40 placeholder:text-xs outline-none ring-0' />
            <FiSearch className='w-4 h-4 absolute top-3 right-3 text-black'/>
        </div>

        <RiMenu3Line onClick={() => setOpenMenu(!openMenu)} className='w-7 h-7 text-white lg:hidden' />

        <nav className='hidden lg:flex'>
          <ul className='flex gap-16 text-[16px] text-white items-center justify-center font-normal'>
            {navigationLinks.map(link => (
              <Link  key={link.path} to={link.path}>
                <li className={`uppercase ${location.pathname === link.path ?  'text-black font-bold' : 'text-white'}`}>{t(`${link.name}`)}</li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>

      <Sheet open={openMenu} onOpenChange={setOpenMenu} >
        <SheetContent side='left'>
            <ul className='w-full flex flex-col gap-6 text-[16px] text-black items-start justify-start px-5 py-5'>
            {navigationLinks.map(link => (
              <Link className='w-full' onClick={() => setOpenMenu(false)} key={link.path} to={link.path}>
                <li className={`uppercase ${location.pathname === link.path ? 'text-primary font-bold w-full' : 'text-black w-full'}`}>{link.name}</li>
              </Link>
            ))}
            </ul>
        </SheetContent>
      </Sheet>

    </div>
  )
}

export default Header