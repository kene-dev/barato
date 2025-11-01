import React from 'react'
import logo from '../assets/logo.png'

function About() {
  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col justify-center items-center px-8 py-10 md:px-14 md:py-14 2xl:px-24 2xl:py-24 gap-8'>
        <h1 className='font-bold text-3xl md:text-4xl text-center text-primary'>Our Story — Why We Started Matrix Scents</h1>
        
        <img src={logo} alt="Matrix Scents Logo" className='my-4 w-48'/>
        
        <div className='flex flex-col gap-6 text-center md:text-left'>
            <p className='text-lg leading-relaxed'>
                Matrix Scents started from a simple truth — <strong>everyone deserves to smell expensive, even if they're shopping on a budget</strong>.
            </p>
            
            <p className='text-base leading-relaxed'>
                We saw how so many perfume lovers admired designer scents from afar, saving screenshots, adding to wishlists, and saying, "One day."
            </p>
            
            <p className='text-base leading-relaxed'>
                But we also noticed something else — the price wasn't always about the perfume itself, it was about the box, the packaging, the presentation.
            </p>
            
            <p className='text-lg font-semibold text-primary my-2'>
                So we asked ourselves a question:
            </p>
            
            <p className='text-xl font-bold text-primary italic'>
                What if we removed the box, but kept the beauty?
            </p>
            
            <p className='text-base leading-relaxed'>
                That's how Matrix Scents was born — to make luxury scents accessible without the luxury price tag.
            </p>
            
            <p className='text-base leading-relaxed'>
                Every unboxed perfume we sell is 100% authentic, carefully sourced, and handled with love. We're not here to sell fakes or imitations — we're here to make sure that the scent you love doesn't have to wait till payday.
            </p>
            
            <p className='text-lg font-semibold my-4'>
                For us, it's more than perfume.
            </p>
            
            <p className='text-base leading-relaxed'>
                It's about <strong className='text-primary'>confidence made affordable</strong>, <strong className='text-primary'>luxury made simple</strong>, and <strong className='text-primary'>trust made possible</strong>.
            </p>
            
            <div className='text-2xl font-bold text-primary text-center mt-8 py-6 border-t-2 border-primary/30'>
                Matrix Scents — luxury scents within reach
            </div>
        </div>
    </div>
  )
}

export default About