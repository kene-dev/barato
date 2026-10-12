import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Tag } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import ProductCard from '@/components/ProductCard'
import { useGetSalesProductsQuery } from '@/app/features/api/productApiSlice'
import { useGetSalesBannerQuery } from '@/app/features/api/salesBannerApiSlice'

const pageSize = 9
const defaultBanner = {
  headline: 'A little luxury, for less.',
  description: 'Explore beautiful scents at prices worth celebrating. Your next favourite might be waiting here.',
}

function Sales() {
  const [page, setPage] = useState(1)
  const { data: savedBanner } = useGetSalesBannerQuery(undefined, { refetchOnMountOrArgChange: true })
  const banner = savedBanner ?? defaultBanner
  const { data: saleProducts = [], isLoading, isError } = useGetSalesProductsQuery()
  const pageCount = Math.ceil(saleProducts.length / pageSize)
  const currentPage = Math.min(page, Math.max(pageCount, 1))
  const visibleProducts = saleProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  // console.log(saleProducts)

  return (
    <main className='min-h-screen bg-[#f9f6f1] pt-20 text-[#30251f]'>
      <div className='mx-auto max-w-[1450px] px-5 pt-7 sm:pt-10 lg:px-10'>
        <section aria-labelledby='sales-heading' className='relative isolate overflow-hidden border border-[#462835] bg-[#39212c] px-6 py-12 text-[#fff7ee] sm:px-10 sm:py-16 lg:min-h-[370px] lg:px-16 lg:py-20'>
          <div aria-hidden='true' className='pointer-events-none absolute -right-16 -top-20 size-72 rounded-full border border-[#f6d8be]/25 sm:size-[420px]' />

          <div aria-hidden='true' className='pointer-events-none absolute -right-5 -top-8 size-56 rounded-full border border-[#f6d8be]/25 sm:size-[330px]' />

          <div aria-hidden='true' className='pointer-events-none absolute right-9 top-7 hidden size-40 rotate-12 items-center justify-center rounded-full border border-dashed border-[#f6d8be]/55 text-center text-3xl tracking-[-.05em] text-[#f6d8be] [font-family:Georgia,serif] lg:flex'>SHOP<br />SALES</div>


          <div className='relative max-w-2xl'>
            <p className='mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.23em] text-[#f2b7d7]'><Tag size={15} aria-hidden='true' /> Matrix Scents / Sales Page</p>
            <h1 id='sales-heading' className="text-[clamp(2.75rem,6vw,5.75rem)] leading-[.98] tracking-[-.055em] [font-family:Georgia,'Times_New_Roman',serif]">{banner.headline}</h1>
            <p className='mt-6 max-w-lg text-sm leading-7 text-[#ead8d0] sm:text-base'>{banner.description}</p>
          </div>
          <div aria-hidden='true' className='absolute inset-x-6 bottom-5 border-t border-[#f6d8be]/30 sm:inset-x-10 lg:inset-x-16' />
        </section>
      </div>

      <div className='mx-auto max-w-[1450px] px-5 py-12 sm:py-16 lg:px-10'>
        <div className='mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#dfd2c5] pb-5'>
          <div>
            <p className='mb-2 text-[11px] font-semibold uppercase tracking-[.18em] text-[#a33075]'>Worth discovering</p>
            <h2 className="text-3xl tracking-[-.045em] sm:text-4xl [font-family:Georgia,'Times_New_Roman',serif]">The marked-down collection</h2>
          </div>
          {!isLoading && !isError && <p className='text-xs text-[#796b60]'>{saleProducts.length} {saleProducts.length === 1 ? 'find' : 'finds'}</p>}
        </div>

        {isLoading ? (
          <div role='status' className='border border-[#e7dfd5] bg-white px-6 py-16 text-center text-sm text-[#685b51]'>Finding the good deals…</div>
        ) : isError ? (
          <div role='alert' className='border border-[#e7dfd5] bg-white px-6 py-16 text-center text-sm text-[#685b51]'>The sale collection could not be loaded. Please try again in a moment.</div>
        ) : saleProducts.length === 0 ? (
          <div className='flex flex-col items-start border border-[#e7dfd5] bg-[#f1e7dc] px-7 py-12 sm:px-12 sm:py-16'>
            <p className='text-[11px] font-semibold uppercase tracking-[.2em] text-[#a33075]'>Nothing on sale right now</p>
            <h3 className="mt-4 max-w-xl text-4xl leading-tight tracking-[-.045em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Good things are still waiting.</h3>
            <p className='mt-4 max-w-md text-sm leading-7 text-[#685b51]'>There are no sale scents at the moment. Browse the full collection to find your next favourite.</p>
            <Link to='/shop' className='mt-7 inline-flex min-h-12 items-center gap-2 bg-[#30251f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#a33075]'>Shop all scents <ArrowUpRight size={17} aria-hidden='true' /></Link>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6'>
              {visibleProducts.map(product => <ProductCard key={product.id} {...product} />)}
            </div>
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel='←'
                nextLabel='→'
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName='pagination'
                activeClassName='active'
                forcePage={currentPage - 1}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default Sales
