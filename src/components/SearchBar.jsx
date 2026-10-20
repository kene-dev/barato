import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowRight, Clock3, Search, Sparkles, X } from 'lucide-react'
import { useGetProductsQuery } from '@/app/features/api/productApiSlice'
import useDebounce from '@/hooks/useDebounce'
import { hasPreviousPrice } from '@/lib/productPricing'

const popularSearches = ['Perfume', 'Cologne', 'Fragrance', 'Designer scents', 'Luxury perfumes']

// eslint-disable-next-line react/prop-types
function SearchModal({ isOpen, onClose, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const debouncedTerm = useDebounce(searchTerm.trim(), 300)
  const { data: suggestionsData, isFetching } = useGetProductsQuery({
    searchTerm: debouncedTerm,
    page: 1,
    pageSize: 5,
    category: '',
    region: '',
    priceRange: [0, 600000],
  }, { skip: debouncedTerm.length < 2 })

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      if (Array.isArray(saved)) setSearchHistory(saved.filter(item => typeof item === 'string').slice(0, 5))
    } catch {
      setSearchHistory([])
    }
  }, [])

  const saveToHistory = term => {
    const updated = [term, ...searchHistory.filter(item => item.toLowerCase() !== term.toLowerCase())].slice(0, 5)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const removeFromHistory = term => {
    const updated = searchHistory.filter(item => item !== term)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const closeModal = () => {
    setSearchTerm('')
    onClose()
  }

  const handleSearch = (term = searchTerm) => {
    const cleanTerm = term.trim()
    if (!cleanTerm) return
    saveToHistory(cleanTerm)
    if (onSearch) onSearch(cleanTerm)
    else navigate(`/search?q=${encodeURIComponent(cleanTerm)}`)
    closeModal()
  }

  const suggestions = suggestionsData?.products || []
  const hasQuery = searchTerm.trim().length >= 2
  const isSearching = isFetching || debouncedTerm !== searchTerm.trim()

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => { if (!open) closeModal() }}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-[60] bg-[#211a18]/70 backdrop-blur-sm' />
        <Dialog.Content
          onOpenAutoFocus={event => { event.preventDefault(); searchInputRef.current?.focus() }}
          className='fixed top-4 left-1/2 z-[61] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[760px] -translate-x-1/2 flex-col overflow-hidden border border-[#d9c8b7] bg-[#faf7f2] text-[#30251f] shadow-[14px_14px_0_#211a1880] focus:outline-none sm:top-8 sm:max-h-[calc(100dvh-4rem)]'
        >
          <div className='shrink-0 border-b border-[#dfd2c5] px-5 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-7'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='mb-2 text-[10px] font-semibold uppercase tracking-[.23em] text-[#a33075]'>Explore Matrix Scents</p>
                <Dialog.Title className="text-3xl leading-tight font-normal tracking-[-.05em] sm:text-4xl [font-family:Georgia,'Times_New_Roman',serif]">Find your next scent.</Dialog.Title>
                <Dialog.Description className='mt-1 text-xs leading-5 text-[#796a5e] sm:text-sm'>Search the collection by scent, brand, or name.</Dialog.Description>
              </div>
              <Dialog.Close asChild><button type='button' aria-label='Close search' className='grid size-9 shrink-0 place-items-center border border-[#d9c8b7] transition-colors hover:bg-[#eee5db] focus-visible:outline-2 focus-visible:outline-[#a33075]'><X size={18} /></button></Dialog.Close>
            </div>

            <form onSubmit={event => { event.preventDefault(); handleSearch() }} className='mt-6 flex min-w-0 border border-[#bba99a] bg-white focus-within:border-[#a33075] focus-within:ring-1 focus-within:ring-[#a33075]'>
              <Search size={20} strokeWidth={1.6} aria-hidden='true' className='my-auto ml-4 shrink-0 text-[#8f7e70]' />
              <input ref={searchInputRef} type='search' value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder='Perfume, brand, or a name you love' aria-label='Search products' className='min-h-13 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#9c8d80] sm:px-4 sm:text-base' />
              <button type='submit' disabled={!searchTerm.trim()} aria-label='View search results' className='grid w-13 shrink-0 place-items-center bg-[#30251f] text-white transition-colors hover:bg-[#a33075] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5'><ArrowRight size={19} aria-hidden='true' /><span className='sr-only'>Search</span></button>
            </form>
          </div>

          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7'>
            {hasQuery ? (
              <div>
                <div className='mb-3 flex items-center justify-between gap-3'>
                  <p className='text-[11px] font-semibold uppercase tracking-[.17em] text-[#8b7267]'>Matching products</p>
                  <span className='text-xs text-[#8b7267]'>{isSearching ? 'Searching…' : `${suggestions.length} shown`}</span>
                </div>
                {isSearching ? <p role='status' className='border-t border-[#e3d8cc] py-10 text-sm text-[#796a5e]'>Looking through the collection…</p> : suggestions.length > 0 ? (
                  <div className='border-t border-[#e3d8cc]'>
                    {suggestions.map(product => {
                      const isOnSale = hasPreviousPrice(product.productPrice, product.discountedPrice)

                      return (
                      <button key={product.id} type='button' onClick={() => { navigate(`/shop/${product.id}`); closeModal() }} className='group flex min-h-22 w-full items-center gap-4 border-b border-[#e3d8cc] py-3 text-left transition-colors hover:bg-[#f2eae1] focus-visible:outline-2 focus-visible:outline-[#a33075]'>
                        <span className='size-16 shrink-0 overflow-hidden bg-[#ece2d7] sm:size-18'>
                          {product.productThumbnail || product.productImage ? <img src={product.productThumbnail || product.productImage} alt='' className='size-full object-cover transition-transform duration-300 group-hover:scale-105' /> : <span className='grid size-full place-items-center text-xl text-[#a33075] [font-family:Georgia,serif]'>M</span>}
                        </span>
                        <span className='min-w-0 flex-1'>
                          <span className="block truncate text-[17px] leading-tight tracking-[-.025em] [font-family:Georgia,'Times_New_Roman',serif]">{product.productName}</span>
                          <span className='mt-1 block truncate text-xs text-[#796a5e]'>{product.productDescription}</span>
                          <span className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1'>
                            <span className='text-xs font-semibold text-[#a33075]'>₦{Number(isOnSale ? product.discountedPrice : product.productPrice).toLocaleString('en-NG', { maximumFractionDigits: 0 })}</span>
                            {isOnSale && <>
                              <del className='text-[10px] text-[#796a5e]'>₦{Number(product.productPrice).toLocaleString('en-NG', { maximumFractionDigits: 0 })}</del>
                              <span className='bg-[#f83dbe] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[.06em] text-[#30251f]'>On sale</span>
                            </>}
                          </span>
                        </span>
                        <ArrowRight size={17} className='mr-1 shrink-0 text-[#a33075] transition-transform group-hover:translate-x-1' aria-hidden='true' />
                      </button>
                      )
                    })}
                  </div>
                ) : <div className='border-t border-[#e3d8cc] py-9'><p className="text-2xl tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">No scent by that name yet.</p><p className='mt-2 text-sm leading-6 text-[#796a5e]'>Try another name, or see the full search results.</p></div>}
                <button type='button' onClick={() => handleSearch()} className='mt-5 inline-flex min-h-11 items-center gap-2 border border-[#30251f] px-5 text-xs font-semibold uppercase tracking-[.08em] transition-colors hover:bg-[#30251f] hover:text-white'>View all results <ArrowRight size={15} aria-hidden='true' /></button>
              </div>
            ) : (
              <div className='grid gap-7 sm:grid-cols-2 sm:gap-8'>
                {searchHistory.length > 0 && <section>
                  <h3 className='mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.17em] text-[#8b7267]'><Clock3 size={15} aria-hidden='true' /> Recent searches</h3>
                  <div className='border-t border-[#e3d8cc]'>
                    {searchHistory.map(term => <div key={term} className='flex items-center border-b border-[#e3d8cc]'>
                      <button type='button' onClick={() => handleSearch(term)} className='min-h-11 min-w-0 flex-1 truncate text-left text-sm transition-colors hover:text-[#a33075]'>{term}</button>
                      <button type='button' onClick={() => removeFromHistory(term)} aria-label={`Remove ${term} from recent searches`} className='grid size-9 shrink-0 place-items-center text-[#9c8d80] transition-colors hover:text-[#a33075]'><X size={15} /></button>
                    </div>)}
                  </div>
                </section>}
                <section className={searchHistory.length ? '' : 'sm:col-span-2'}>
                  <h3 className='mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.17em] text-[#8b7267]'><Sparkles size={15} aria-hidden='true' /> Start somewhere</h3>
                  <div className='flex flex-wrap gap-2'>
                    {popularSearches.map(term => <button key={term} type='button' onClick={() => handleSearch(term)} className='min-h-10 border border-[#d8c9ba] bg-[#f5eee7] px-3 text-xs font-medium transition-colors hover:border-[#a33075] hover:bg-[#f5e4ed] hover:text-[#8f215f]'>{term}</button>)}
                  </div>
                </section>
              </div>
            )}
          </div>
          <div className='h-1 shrink-0 bg-[#a33075]' aria-hidden='true' />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default SearchModal
