import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import shopBanner from '../assets/shop-editorial.jpg';
import ProductCard from '@/components/ProductCard';
import { IoFilter } from "react-icons/io5";
import CatalogFilters from '@/components/CatalogFilters';
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
  const [openMenu, setOpenMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { data: categories } = useGetCategoriesQuery({ searchTerm: '' })
  const { data: regions } = useGetRegionsQuery({ searchTerm: '' })

  const location = useLocation();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 8,
    searchTerm: '',
    category: location.state?.category || '',
    region: '',
    priceRange: [0, 600000]
  });

  const { data, isLoading, isError } = useGetProductsQuery(filters)
  const activeFilterCount = Number(Boolean(filters.category)) + Number(Boolean(filters.region)) + Number(filters.priceRange[0] > 0 || filters.priceRange[1] < 600000)

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
    offScreen: { x: 10, opacity: 0 },
    onScreen: (i) => ({
      x: 0,
      opacity: 1,
      transition: { duration: 1.5, type: "spring", delay: i * 0.3 },
    }),
  };

  useEffect(() => {
    if (window.screen.width <= 800) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }else{
       window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }, [filters.page])

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

  // console.log(data)


  return (
    <div className='w-full min-h-screen bg-[#f9f6f1] pt-20'>
      <div className='mx-auto max-w-[1450px] px-5 pt-7 pb-12 sm:pt-10 sm:pb-16 lg:px-10'>
        <section className='relative isolate flex min-h-[290px] items-center overflow-hidden border border-[#e7dfd5] bg-[#f3e4d2] sm:min-h-[350px] lg:min-h-[390px]' aria-labelledby='shop-heading'>
          <img src={shopBanner} alt='An amber fragrance bottle with a burgundy flower on a warm stone surface' className='absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center' fetchPriority='high' />
          <div className='absolute inset-0 bg-gradient-to-r from-[#f5e8d9]/95 via-[#f5e8d9]/75 to-transparent sm:from-[#f5e8d9]/90 sm:via-[#f5e8d9]/30' />
          <div className='relative max-w-[440px] px-6 py-10 text-[#30251f] sm:px-10 lg:px-16'>
            <p className='mb-4 text-[11px] font-semibold tracking-[.25em] uppercase text-[#a33075]'>The Matrix Scents edit</p>
            <h1 id='shop-heading' className="text-5xl leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-7xl [font-family:Georgia,'Times_New_Roman',serif]">Find your next favourite.</h1>
            <p className='mt-5 max-w-[300px] text-sm leading-6 sm:text-base'>Scents and little luxuries worth making room for.</p>
          </div>
        </section>
      </div>

      {/* PRODUCTS AREA */}
      <div className='mx-auto flex w-full max-w-[1450px] items-start gap-7 px-5 pb-16 lg:px-10'>
        <CatalogFilters
          categories={categories || []}
          regions={regions || []}
          filters={filters}
          onChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          onClearAll={() => handleFilterChange({ category: '', region: '', priceRange: [0, 600000] })}
        />

        <Sheet open={openMenu} onOpenChange={setOpenMenu}>
          <SheetContent side='left' className='w-[min(92vw,380px)] border-[#e4d8ca] p-0 sm:max-w-[380px]'>
            <CatalogFilters
              mobile
              categories={categories || []}
              regions={regions || []}
              filters={filters}
              onChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              onClearAll={() => handleFilterChange({ category: '', region: '', priceRange: [0, 600000] })}
              onDone={() => setOpenMenu(false)}
            />
          </SheetContent>
        </Sheet>

        {/* MAIN PRODUCT CARD AREA */}
        <div className='relative mb-10 flex min-w-0 flex-1 flex-col'>


          {isLoading ? (
            <p role='status' className='border border-[#e7dfd5] bg-white p-8 text-sm text-[#76685d]'>Finding your next scent…</p>
          ) : isError ? (
            <p role='alert' className='border border-[#e7dfd5] bg-white p-8 text-sm text-[#76685d]'>The collection could not be loaded. Please try again in a moment.</p>
          ) : (

          <div className='relative grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6'>

            <button type='button' className='col-span-full mb-2 flex min-h-11 w-max items-center justify-center gap-3 border border-[#30251f] bg-[#30251f] px-5 text-sm font-medium text-white lg:hidden' onClick={() => setOpenMenu(true)}>
              <IoFilter className='text-white w-5 h-5' />
              Filters {activeFilterCount > 0 && <span className='grid size-5 place-items-center bg-[#f83dbe] text-[10px] text-[#30251f]'>{activeFilterCount}</span>}
            </button>

            <AnimatePresence mode='sync'>
              {data?.products?.map((product, index) => (
                <motion.div
                  layout
                  variants={cardAnimate}
                  initial='offScreen'
                  whileInView="onScreen"
                  viewport={{ once: true, amount: 0.1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: .3, ease: "linear" }}
                  key={product.id}
                  custom={index}
                  className='h-full min-w-0'
                >
                  <ProductCard key={product.id} {...product} />
                </motion.div>

              ))}
            </AnimatePresence>

            {data?.products?.length === 0 && <div className='col-span-full border border-[#e7dfd5] bg-[#f1e7dc] px-7 py-12 sm:px-12 sm:py-16'>
              <p className='text-[11px] font-semibold uppercase tracking-[.2em] text-[#a33075]'>Nothing in this edit</p>
              <h2 className="mt-3 text-3xl tracking-[-.045em] [font-family:Georgia,'Times_New_Roman',serif]">{activeFilterCount > 0 ? 'No scents match these filters.' : 'New scents are on their way.'}</h2>
              <p className='mt-3 max-w-md text-sm leading-7 text-[#685b51]'>{activeFilterCount > 0 ? 'Try widening your selection to find something lovely.' : 'Check back soon to explore the collection.'}</p>
              {activeFilterCount > 0 && <button type='button' onClick={() => handleFilterChange({ category: '', region: '', priceRange: [0, 600000] })} className='mt-6 min-h-11 bg-[#30251f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#a33075]'>Clear all filters</button>}
            </div>}

            {data?.totalCount > filters.pageSize && <ReactPaginate
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
          />}
          </div>


          )}



        </div>
      </div>
    </div>
  )
}

export default Shop
