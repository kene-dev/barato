import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"
import { carouselData } from '@/lib/carouselData'
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Button } from '../ui/button';
import { Link } from 'react-router';
// import ad1 from '../../assets/shop-banner.jpg'
// import ad2 from '../../assets/ad2.png'
// import ad3 from '../../assets/ad3.png'

const Hero = () => {
  return (
    <div>
        <Carousel opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
            Fade()
          ]} className='w-full mb-10'>
            <CarouselContent>
                {carouselData.map((item, index) => (
                    <CarouselItem key={index}>
                        <div style={{backgroundImage: `url(${item.image})`}} className='w-full lg:h-[450px] h-[400px] relative bg-cover bg-no-repeat bg-right lg:bg-center'>

                            {/* Desktop version */}
                            <div className='hidden lg:flex absolute z-10 lg:top-1/4 lg:right-20 inset-0 text-right flex-col lg:items-end items-center justify-center lg:justify-start lg:gap-4 gap-4  lg:backdrop-opacity-0  lg:bg-transparent'>

                                <h1 className='text-primary lg:text-4xl text-3xl font-bold lg:text-right text-center drop-shadow-2xl' style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>{item.title}</h1>
                                <p className='w-[350px] lg:text-right text-center text-base text-white lg:text-white font-medium' style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>{item.subText}</p>
                                <Link to="/shop">
                                    <Button className='text-white'> 
                                        Shop Now
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile version */}
                            <div className='lg:hidden absolute z-10 inset-0 flex items-center justify-center'>
                                <div className='text-center px-4'>
                                    <h1 className='text-primary text-2xl font-bold mb-2' style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{item.title}</h1>
                                    <p className='text-white text-sm font-medium mb-4' style={{textShadow: '1px 1px 3px rgba(0,0,0,0.9)'}}>{item.subText}</p>
                                    <Link to="/shop">
                                        <Button className='text-white bg-primary/90 backdrop-blur-sm'> 
                                            Shop Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>

        {/* <div className='w-full 2xl:w-[80%] flex flex-col gap-7 2xl:gap-12 lg:flex-row items-center justify-between my-10 lg:px-10 2xl:px-0 px-5 mx-auto'>
            <img src={ad1} className='lg:w-[400px] 2xl:w-[500px] w-full drop-shadow-md' />
            <img src={ad2} className='lg:w-[400px] 2xl:w-[500px] w-full drop-shadow-md' />
            <img src={ad3} className='lg:w-[400px] 2xl:w-[500px] w-full drop-shadow-md' />
        </div> */}
    </div>
  )
}

export default Hero
