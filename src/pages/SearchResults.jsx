import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import ProductCard from '@/components/ProductCard'
import { IoFilter, IoClose } from "react-icons/io5"
import CatalogFilters from '@/components/CatalogFilters'
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice'
import { useGetRegionsQuery } from '@/app/features/api/regionsApiSlice'
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
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [openMenu, setOpenMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { data: categories } = useGetCategoriesQuery({ searchTerm: '' })
  const { data: regions } = useGetRegionsQuery({ searchTerm: '' })

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 8,
    searchTerm: query,
    category: '',
    region: '',
    priceRange: [0, 600000]
  })

  const { data, isLoading, isError } = useGetProductsQuery(filters)

  // Update search term when query param changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      searchTerm: query,
      page: 1
    }))
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
      region: '',
      priceRange: [0, 600000],
      page: 1
    }))
  }

  const hasActiveFilters = filters.category || filters.region ||
    filters.priceRange[0] > 0 || filters.priceRange[1] < 600000
  const activeFilterCount = Number(Boolean(filters.category)) + Number(Boolean(filters.region)) + Number(filters.priceRange[0] > 0 || filters.priceRange[1] < 600000)

  const cardAnimate = {
    offScreen: { y: 10, opacity: 0 },
    onScreen: (i) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 1.5, type: "spring", delay: i * 0.3 },
    }),
  }

  useEffect(() => {
    if (window.screen.width <= 820) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filters.page])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className='min-h-screen bg-[#f9f6f1] pt-20 text-[#30251f]'>
      {/* Header Section */}
      <div className='border-b border-[#e3d7c9] bg-[#f1e7dc] py-11 sm:py-14'>
        <div className='mx-auto max-w-[1450px] px-5 lg:px-10'>
          <div className='mb-4 flex flex-wrap items-start justify-between gap-4'>
            <h1 className="text-4xl leading-tight tracking-[-.05em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">
              {query ? (
                <>
                  Search results for “<span className='text-[#a33075]'>{query}</span>”
                </>
              ) : (
                'Search Products'
              )}
            </h1>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                type='button'
                className='inline-flex min-h-10 items-center gap-2 border border-[#d6c7b9] px-4 text-xs font-semibold uppercase tracking-[.08em] text-[#685b51] transition-colors hover:bg-white'
              >
                <IoClose className='w-4 h-4' />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className='flex flex-wrap items-center justify-between gap-3 text-sm text-[#685b51]'>
            <p>
              {data?.totalCount ? (
                <>
                  Found <span className='font-semibold text-[#a33075]'>{data.totalCount}</span> product{data.totalCount !== 1 ? 's' : ''}
                </>
              ) : (
                'No products found'
              )}
            </p>
            {hasActiveFilters && (
              <div className='flex flex-wrap items-center gap-2'>
                {filters.category && (
                  <span className='border border-[#dfbfd0] bg-[#f6e8ef] px-2.5 py-1 text-xs text-[#8f215f]'>
                    {categories?.find(category => category.id === filters.category)?.categoryName || 'Category selected'}
                  </span>
                )}
                {filters.region && (
                  <span className='border border-[#dfbfd0] bg-[#f6e8ef] px-2.5 py-1 text-xs text-[#8f215f]'>
                    {regions?.find(region => region.id === filters.region)?.regionName || 'Brand selected'}
                  </span>
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 600000) && (
                  <span className='border border-[#dfbfd0] bg-[#f6e8ef] px-2.5 py-1 text-xs text-[#8f215f]'>
                    Price: ₦{filters.priceRange[0].toLocaleString()} - ₦{filters.priceRange[1].toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto flex w-full max-w-[1450px] items-start gap-7 px-5 py-10 lg:px-10'>
        <CatalogFilters
          categories={categories || []}
          regions={regions || []}
          filters={filters}
          onChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          onClearAll={clearFilters}
        />

        {/* Products Area */}
        <div className='mb-10 flex min-w-0 flex-1 flex-col'>
          <div className='relative grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Mobile Filter Button */}
            <button type='button' className='col-span-full mb-2 flex min-h-11 w-max items-center gap-3 border border-[#30251f] bg-[#30251f] px-5 text-sm font-medium text-white lg:hidden' onClick={() => setOpenMenu(true)}>
              <IoFilter className='text-white w-5 h-5' />
              Filters {activeFilterCount > 0 && <span className='grid size-5 place-items-center bg-[#f83dbe] text-[10px] text-[#30251f]'>{activeFilterCount}</span>}
            </button>

            {isLoading ? <p role='status' className='col-span-full border border-[#e3d7c9] bg-white p-8 text-sm text-[#685b51]'>Searching the collection…</p> : isError ? <p role='alert' className='col-span-full border border-[#e3d7c9] bg-white p-8 text-sm text-[#685b51]'>Search results could not be loaded. Please try again in a moment.</p> : data?.products?.length > 0 ? (
              <>
                <AnimatePresence mode='sync'>
                  {data.products.map((product, index) => (
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
              </>
            ) : (
              <div className='col-span-full w-full border border-[#e3d7c9] bg-[#f1e7dc] px-7 py-12 sm:px-12 sm:py-16'>
                <Search className='mb-5 size-9 text-[#a33075]' strokeWidth={1.5} />
                <h3 className="mb-3 text-3xl tracking-[-.045em] text-[#30251f] [font-family:Georgia,'Times_New_Roman',serif]">No products found.</h3>
                <p className='mb-6 max-w-md text-sm leading-7 text-[#685b51]'>
                  {query
                    ? `We couldn't find any products matching "${query}". Try adjusting your filters or search term.`
                    : 'Start searching to find products.'}
                </p>
                <button
                  onClick={clearFilters}
                  type='button'
                  className='min-h-11 bg-[#30251f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#a33075]'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {data?.totalCount > filters.pageSize && <ReactPaginate
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
          />}
        </div>
      </div>

      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetContent side='left' className='w-[min(92vw,380px)] border-[#e4d8ca] p-0 sm:max-w-[380px]'>
          <CatalogFilters
            mobile
            categories={categories || []}
            regions={regions || []}
            filters={filters}
            onChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            onClearAll={clearFilters}
            onDone={() => setOpenMenu(false)}
          />
        </SheetContent>
      </Sheet>
    </main>
  )
}

export default SearchResults
