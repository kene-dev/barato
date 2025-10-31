import React from 'react'
import twitter from '/src/assets/x.svg'
import instagram from '/src/assets/ig.svg'
import facebook from '/src/assets/fb.svg'
import line from '/src/assets/Line.svg'
import logo from '../assets/logo.png';

function Footer() {
  return (

      // we can remove the margin top
    <div className='w-screen lg:h-[400px] h-full'>



      {/* first section bg-red */}
      {/* 
        Blending with primary color (like header), keeping original layout/positioning/responsiveness.
        For social icons: all icons should appear circular, with a bg-white base and a border-primary ring, and on hover their background fills with the primary color and the icon color flips to white, visually matching the header accent style.
      */}
      <div className="bg-primary/10 w-full h-full">
        <div className='bg-primary h-[86%] lg:px-10 px-5 text-white flex lg:flex-row flex-col items-center justify-between lg:pt-0 pt-10'>
          <div className='w-full flex flex-col gap-4 lg:w-1/3'>
            <div>
              <img src={logo} className='w-36 object-contain bg-white rounded-xl border-2 border-primary shadow-sm p-2' />
              <h1 className='text-lg text-white drop-shadow'>Shop Smart,shop more</h1>
            </div>
            <p className='text-sm text-white/90'>
              Find everything you need, from groceries to household essentials, all in one place – delivered straight to your doorstep!
            </p>
          </div>
          
          <div className='w-full flex flex-col lg:flex-row justify-between items-start lg:w-2/3 lg:mx-64 gap-10 mb-10 lg:mt-0 mt-8'>
            <div className='flex flex-col gap-3'>
              <h1 className='font-semibold text-[20px] text-white'>PAGES</h1>
              <img src={line} alt="" className='w-[35px]' />
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>Home</a>
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>About</a>
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>Shop</a>
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>FAQ</a>
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>Contact</a>
            </div>
            <div className='flex flex-col gap-3'>
              <h1 className='font-semibold text-[20px] text-white'>LINKS</h1>
              <img src={line} alt="" className='w-[35px]' />
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>Terms & Conditions</a>
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>Shipping & Delivery</a>
              <a href='#' className='text-sm text-white hover:bg-white/90 hover:text-primary transition-colors px-2 py-1 rounded'>Privacy Policy</a>
            </div>
            <div className='flex flex-col gap-3'>
              <h1 className='font-semibold text-[20px] text-white'>SOCIALS</h1>
              <img src={line} alt="" className='w-[35px]' />
              <div className='flex gap-4'>
                <a href="#" className='flex items-center justify-center w-10 h-10'>
                  <img src={twitter} alt="Twitter" className='w-5 h-5' />
                </a>

                <a href="#" className='flex items-center justify-center w-10 h-10'>
                  <img src={instagram} alt="Instagram" className='w-5 h-5 ' />
                </a>
                <a href="#" className='flex items-center justify-center w-10 h-10'>
                  <img src={facebook} alt="Facebook" className='w-5 h-5' />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='h-[14%] bg-primary text-white flex justify-center items-center font-semibold lg:text-[20px] text-base p-2'>
          Copyright c 2025. All rights reserved 
        </div>
      </div>



      {/* <div className='bg-primary h-[86%] lg:px-10 px-5 text-white flex lg:flex-row flex-col items-center justify-between lg:pt-0 pt-10'>
        <div className='w-full flex flex-col gap-4  lg:w-1/3'>
        <div>
          <img src={logo} className='w-36 object-contain ' />
          <h1 className='text-lg'>Shop Smart,shop more</h1>
        </div>

         <p className='text-sm '>Find everything you need, from groceries to household essentials, all in one place – delivered straight to your doorstep!</p>
        </div>
        
        <div className='w-full flex flex-col lg:flex-row justify-between items-start  lg:w-2/3 lg:mx-64 gap-10 mb-10 lg:mt-0 mt-8'>
          <div className='flex flex-col gap-3'>
            <h1 className='font-semibold text-[20px]'>PAGES</h1>
            <img src={line} alt="" className='w-[35px] ' />
            <a href='#' className='text-sm'>Home</a>
            <a href='#' className='text-sm'>About</a>
            <a href='#' className='text-sm'>Shop</a>
            <a href='#' className='text-sm'>FAQ</a>
            <a href='#' className='text-sm'>Contact</a>
          </div>
          <div className='flex flex-col gap-3'>
            <h1 className='font-semibold text-[20px]'>LINKS</h1>
            <img src={line} alt="" className='w-[35px] ' />
            <a href='#' className='text-sm'>Terms & Conditions</a>
            <a href='#' className='text-sm'>Shipping & Delivery</a>
            <a href='#' className='text-sm'>Privacy Policy</a>
          </div>
          <div className='flex flex-col gap-3'>
            <h1 className='font-semibold text-[20px]'>SOCIALS</h1>
            <img src={line} alt="" className='w-[35px] ' />
            <div className='flex gap-4 w-5 h-5 '>
              <img src={twitter} alt="" />
              <img src={instagram} alt="" />
              <img src={facebook} alt="" />
            </div>
          </div>
        </div>
      </div> */}

      {/* second section bg-black */}

      {/* <div className='h-[14%] bg-black text-white flex justify-center items-center font-semibold lg:text-[20px] text-base p-2'>
        Copyright c 2025. All rights reserved 
      </div> */}
    </div>
  )
}

export default Footer