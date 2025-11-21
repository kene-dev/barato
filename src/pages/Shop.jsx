import { useEffect, useState } from 'react'
import shopBanner from '../assets/shop-banner.jpg';
import ProductCard from '@/components/ProductCard';
import { IoFilter } from "react-icons/io5";
import RangeSlider from '@/components/RangeSlider';
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice';
import { useGetProductsQuery } from '@/app/features/api/productApiSlice';
import useDebounce from '@/hooks/useDebounce';
import { useGetRegionsQuery } from '@/app/features/api/regionsApiSlice';
import ReactPaginate from 'react-paginate';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";



function Shop() {
 const [cat, setCat] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
 const {data: categories} = useGetCategoriesQuery({searchTerm: ''})
 const {data: regions} = useGetRegionsQuery({searchTerm: ''})

 const [filters, setFilters] = useState({
  page: 1,
  pageSize: 8,
  searchTerm: '',
  category: '',
  region: '',
  priceRange: [0, 600000]
});

 const {data } = useGetProductsQuery(filters)

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Debounce the entire price range array
  const debouncedPriceRange = useDebounce(filters.priceRange, 300);

  // Update filters when debounced value changes
  useEffect(() => {
    handleFilterChange({ priceRange: debouncedPriceRange });
  }, [debouncedPriceRange]);

  const handlePriceChange = (min, max) => {
    // Update local state immediately
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handlePageClick = ({ selected }) => {
    setFilters(prev => ({
      ...prev,
      page: selected + 1 // Convert from zero-based to one-based
    }));
  };

   const cardAnimate = {
    offScreen: { y: 10, opacity: 0 },
    onScreen: (i) => ({
      y: 0,
      opacity: 1,
      transition: {duration: 1.5, type: "spring", delay: i * 0.3 },
    }),
  };

useEffect(() => {
 if(window.screen.width <= 820){
   window.scrollTo({ top: 0, behavior: 'smooth' });
 }
},[filters.page])

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }
  
  // Set initial value
  handleResize()
  
  // Add event listener
  window.addEventListener('resize', handleResize)
  
  // Cleanup
  return () => window.removeEventListener('resize', handleResize)
}, [])

  return (
    <div className='w-full h-full overflow-y-scroll'>
        <div className='lg:w-[60%] mx-auto px-5'>
          <img src={shopBanner} className='my-10 mb-20' />
        </div>

        {/* PRODUCTS AREA */}
        <div className='w-full lg:h-screen 2xl:w-[80%] mx-auto flex items-start gap-5 lg:px-10'>
          {/*  WEB SCREEN FILTER AREA */}
          <div className='lg:w-[441px] hidden lg:flex flex-col p-3 capitalize'>
            <h1 className='text-primary font-semibold'>Filters</h1>
            <div className='w-full my-2'>

              <div className='w-full flex items-center justify-between text-primary font-semibold'>
                <p>Categories</p>
                <p onClick={() => handleFilterChange({ category: '' })}>Reset</p>
              </div>

              <hr className='h-[1px] bg-black/70'/>
              
              <div className='w-full flex flex-col gap-2 my-2'>
                {categories?.map((category) => (
                  <div key={category.id} className='w-full flex items-center justify-between'>
                    <p>{category.categoryName}</p>
                    <input onChange={() => handleFilterChange({ category: category.id })}  checked={filters.category === category.id}  type='checkbox' className='bg-gray-200 w-4 h-4' />
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full my-5 h-[300px] overflow-y-scroll'>
              <div className='w-full flex items-center justify-between text-primary font-semibold'>
                <p>Brands</p>
                <p onClick={() => handleFilterChange({ region: '' })}>Reset</p>
              </div>
              <hr className='h-[1px] bg-black/70'/>
              <div className='w-full flex flex-col gap-2 my-2'>
                {regions?.map((region) => (
                  <div key={region.id} className='w-full flex items-center justify-between'>
                    <p>{region.regionName}</p>
                    <input onChange={() => handleFilterChange({ region: region.id })}  checked={filters.region === region.id} type='checkbox' className=' bg-gray-200 w-4 h-4' />
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full my-5'>
              <div className='w-full flex items-center justify-between text-primary font-semibold'>
                <p>Price Range</p>
                {/* <p className='cursor-pointer' onClick={() => handlePriceChange(0, 1000)}>Reset</p> */}
              </div>
              <hr className='h-[1px] bg-black/70'/>
              <RangeSlider min={0} max={600000} step={1} onChange={handlePriceChange} />
            </div>
          </div>


              
          {/*  MOBILE SCREEN FILTER AREA */}
           <Sheet open={openMenu} onOpenChange={setOpenMenu} >
              <SheetContent side='left'>
                 <div className='p-3'>
                    <h1>Filters</h1>
                    <div className='w-full my-2'>

                      <div className='w-full flex items-center justify-between text-primary font-semibold'>
                        <p>Categories</p>
                        <p onClick={() => handleFilterChange({ category: '' })}>Reset</p>
                      </div>

                      <hr className='h-[1px] bg-black/70'/>
                      
                      <div className='w-full flex flex-col gap-2 my-2'>
                      {categories?.map((category) => (
                        <div key={category.id} className='w-full flex items-center justify-between'>
                          <p>{category.categoryName}</p>
                          <input onChange={() => handleFilterChange({ category: category.id })}  checked={filters.category === category.id}  type='checkbox' className='bg-gray-200 w-4 h-4' />
                        </div>
                      ))}
                      </div>
                    </div>

                    <div className='w-full h-[300px] overflow-y-scroll my-5'>
                      <div className='w-full flex items-center justify-between text-primary font-semibold'>
                        <p>Brands</p>
                        <p onClick={() => handleFilterChange({ region: '' })}>Reset</p>
                      </div>
                      <hr className='h-[1px] bg-black/70'/>
                      <div className='w-full flex flex-col gap-2 my-2'>

                        {regions?.map((region) => (
                        <div key={region.id} className='w-full flex items-center justify-between'>
                          <p>{region.regionName}</p>
                          <input onChange={() => handleFilterChange({ region: region.id })}  checked={filters.region === region.id} type='checkbox' className=' bg-gray-200 w-4 h-4' />
                        </div>
                      ))}

                      </div>
                    </div>

                    <div className='w-full my-5'>
                      <div className='w-full flex items-center justify-between text-primary font-semibold'>
                        <p>Price Range</p>
                        <p className='cursor-pointer' onClick={() => handlePriceChange(0, 1000)}>Reset</p>
                      </div>
                      <hr className='h-[1px] bg-black/70'/>
                      <RangeSlider min={0} max={600000} step={10} onChange={handlePriceChange} />
                    </div>
                  </div>
              </SheetContent>
            </Sheet>
          
            
          {/* MAIN PRODUCT CARD AREA */}
          <div className='w-full md:h-max h-full flex flex-col mb-10 overflow-y-scroll'>
              
            <div className='w-full h-full flex flex-col  md:grid md:grid-cols-3 lg:flex lg:flex-row  lg:items-start items-center lg:flex-wrap gap-3 2xl:gap-8 py-6 px-5 lg:px-0 md:mx-auto relative'>

              <div className='lg:hidden sticky top-3 z-40 w-1/2 h-[40px] px-6 flex items-center justify-center gap-3 bg-primary text-white rounded-md font-semibold place-self-start' onClick={() => setOpenMenu(!openMenu)}>
                <IoFilter className='text-white w-5 h-5' />
                Filters
              </div>

               <AnimatePresence mode='sync'>
                {data?.products?.map((product,index) => (
                  <motion.div
                    layout
                    variants={cardAnimate}
                    initial='offScreen'
                    whileInView="onScreen"
                    viewport={{once: true, amount:0.1}}
                    exit={{y:-10, opacity:0}}
                    transition={{duration:.3, ease:"linear"}}
                    key={product.id}
                    custom={index}
                    className='w-full md-h-max lg:w-max sticky lg:static top-10'
                    >
                      <ProductCard key={product.id} {...product} />
                    </motion.div>

                ))}
               </AnimatePresence>
            </div>

              <ReactPaginate
                previousLabel="←"
                nextLabel="→"
                pageCount={Math.ceil(data?.totalCount / filters.pageSize)}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                activeClassName="active"
                forcePage={filters.page - 1} // Convert to zero-based index
                disableInitialCallback={true}
                marginPagesDisplayed={1}
                pageRangeDisplayed={isMobile ? 2 : 5}
              />

          </div>
        </div>
    </div>
  )
}

export default Shop