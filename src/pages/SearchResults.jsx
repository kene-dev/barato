import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import ProductCard from '@/components/ProductCard'
import { IoFilter, IoClose } from "react-icons/io5"
import RangeSlider from '@/components/RangeSlider'
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice'
import { useGetProductsQuery } from '@/app/features/api/productApiSlice'
import useDebounce from '@/hooks/useDebounce'
import ReactPaginate from 'react-paginate'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Search } from 'lucide-react'

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  const [openMenu, setOpenMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { data: categories } = useGetCategoriesQuery({ searchTerm: '' })

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 8,
    searchTerm: query,
    category: '',
    priceRange: [0, 600000]
  })

  const { data } = useGetProductsQuery(filters)

  // Update search term when query param changes
  useEffect(() => {
    if (query) {
      setFilters(prev => ({
        ...prev,
        searchTerm: query,
        page: 1
      }))
    }
  }, [query])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }))
  }

  const debouncedPriceRange = useDebounce(filters.priceRange, 300)

  useEffect(() => {
    handleFilterChange({ priceRange: debouncedPriceRange })
  }, [debouncedPriceRange])

  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }))
  }

  const handlePageClick = ({ selected }) => {
    setFilters(prev => ({
      ...prev,
      page: selected + 1
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      category: '',
      priceRange: [0, 600000],
      page: 1
    }))
  }

  const hasActiveFilters = filters.category || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 600000

  const cardAnimate = {
    offScreen: { y: 10, opacity: 0 },
    onScreen: (i) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 1.5, type: "spring", delay: i * 0.3 },
    }),
  }

  useEffect(() => {
    if(window.screen.width <= 820){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },[filters.page])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      {/* Header Section */}
      <div className='bg-white border-b border-gray-200 py-6'>
        <div className='max-w-7xl mx-auto px-5 md:px-8 lg:px-14'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
              {query ? (
                <>
                  Search Results for "<span className='text-primary'>{query}</span>"
                </>
              ) : (
                'Search Products'
              )}
            </h1>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors'
              >
                <IoClose className='w-4 h-4' />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <p>
              {data?.totalCount ? (
                <>
                  Found <span className='font-semibold text-primary'>{data.totalCount}</span> product{data.totalCount !== 1 ? 's' : ''}
                </>
              ) : (
                'No products found'
              )}
            </p>
            {hasActiveFilters && (
              <div className='flex items-center gap-2 flex-wrap'>
                {filters.category && (
                  <span className='px-2 py-1 bg-primary/10 text-primary rounded text-xs'>
                    Category Filtered
                  </span>
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 600000) && (
                  <span className='px-2 py-1 bg-primary/10 text-primary rounded text-xs'>
                    Price: ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full lg:h-screen 2xl:w-[80%] mx-auto flex items-start gap-5 lg:px-10'>
        {/* Desktop Filters */}
        <div className='lg:w-[441px] hidden lg:flex flex-col p-3'>
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
                  <input 
                    onChange={() => handleFilterChange({ category: category.id })}  
                    checked={filters.category === category.id}  
                    type='checkbox' 
                    className='bg-gray-200 w-4 h-4' 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='w-full my-5'>
            <div className='w-full flex items-center justify-between text-primary font-semibold'>
              <p>Price Range</p>
            </div>
            <hr className='h-[1px] bg-black/70'/>
            <RangeSlider min={0} max={600000} step={1} onChange={handlePriceChange} />
          </div>
        </div>

        {/* Products Area */}
        <div className='w-full h-full flex flex-col mb-10'>
          <div className='w-full h-full flex flex-col md:grid md:grid-cols-3 lg:flex lg:flex-row lg:items-start items-center lg:flex-wrap gap-3 2xl:gap-8 py-6 px-5 lg:px-0 md:mx-auto relative'>
            {/* Mobile Filter Button */}
            <div className='lg:hidden sticky top-3 z-40 w-1/2 h-[40px] px-6 flex items-center justify-center gap-3 bg-primary text-white rounded-md font-semibold place-self-start' onClick={() => setOpenMenu(!openMenu)}>
              <IoFilter className='text-white w-5 h-5' />
              Filters
            </div>

            {data?.products?.length > 0 ? (
              <>
                <AnimatePresence mode='sync'>
                  {data.products.map((product, index) => (
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
                      className='w-full lg:w-max sticky lg:static top-10'
                    >
                      <ProductCard key={product.id} {...product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            ) : (
              <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
                <Search className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>No products found</h3>
                <p className='text-gray-600 mb-6'>
                  {query
                    ? `We couldn't find any products matching "${query}". Try adjusting your filters or search term.`
                    : 'Start searching to find products.'}
                </p>
                <button
                  onClick={clearFilters}
                  className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <ReactPaginate
            previousLabel="←"
            nextLabel="→"
            pageCount={Math.ceil(data?.totalCount / filters.pageSize)}
            onPageChange={handlePageClick}
            containerClassName="pagination"
            activeClassName="active"
            forcePage={filters.page - 1}
            disableInitialCallback={true}
            marginPagesDisplayed={1}
            pageRangeDisplayed={isMobile ? 2 : 5}
          />
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
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
                    <input 
                      onChange={() => handleFilterChange({ category: category.id })}  
                      checked={filters.category === category.id}  
                      type='checkbox' 
                      className='bg-gray-200 w-4 h-4' 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='w-full my-5'>
              <div className='w-full flex items-center justify-between text-primary font-semibold'>
                <p>Price Range</p>
                <p className='cursor-pointer' onClick={() => handlePriceChange(0, 600000)}>Reset</p>
              </div>
              <hr className='h-[1px] bg-black/70'/>
              <RangeSlider min={0} max={600000} step={10} onChange={handlePriceChange} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SearchResults

