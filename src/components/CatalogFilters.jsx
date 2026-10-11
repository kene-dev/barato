/* eslint-disable react/prop-types */
import RangeSlider from '@/components/RangeSlider'
import { SheetDescription, SheetTitle } from '@/components/ui/sheet'

const maxPrice = 600000

function CatalogFilters({ categories = [], regions, filters, onChange, onPriceChange, onClearAll, mobile = false, onDone }) {
  const hasPriceFilter = filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice
  const activeCount = Number(Boolean(filters.category)) + Number(Boolean(filters.region)) + Number(hasPriceFilter)

  const renderOptions = (items, field, nameKey) => (
    <div className='flex max-h-56 flex-col gap-1 overflow-y-auto pr-1'>
      {items?.length ? items.map(item => {
        const selected = filters[field] === item.id
        return (
          <button
            key={item.id}
            type='button'
            aria-pressed={selected}
            onClick={() => onChange({ [field]: selected ? '' : item.id })}
            className={`flex min-h-10 w-full items-center gap-2.5 px-2 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a33075] ${selected ? 'bg-[#f5e4ed] font-semibold text-[#8f215f]' : 'text-[#62554c] hover:bg-[#f3eee8]'}`}
          >
            <span aria-hidden='true' className={`size-3 shrink-0 rounded-full border ${selected ? 'border-[#a33075] bg-[#a33075] shadow-[inset_0_0_0_2px_#f5e4ed]' : 'border-[#b8a99c]'}`} />
            <span className='min-w-0 break-words'>{item[nameKey]}</span>
          </button>
        )
      }) : <p className='px-2 py-2 text-xs leading-5 text-[#8d7c6e]'>No options available yet.</p>}
    </div>
  )

  const sections = (
    <div className='min-h-0 flex-1 overflow-y-auto'>
      <section className='border-b border-[#e9dfd5] px-4 py-5' aria-label='Category filters'>
        <div className='mb-3 flex items-center justify-between px-1'>
          <h3 className='text-[11px] font-bold uppercase tracking-[.15em]'>Category</h3>
          {filters.category && <button type='button' onClick={() => onChange({ category: '' })} className='text-[11px] text-[#8d7266] underline underline-offset-2 hover:text-[#a33075]'>Clear</button>}
        </div>
        {renderOptions(categories, 'category', 'categoryName')}
      </section>

      {regions && <section className='border-b border-[#e9dfd5] px-4 py-5' aria-label='Brand filters'>
        <div className='mb-3 flex items-center justify-between px-1'>
          <h3 className='text-[11px] font-bold uppercase tracking-[.15em]'>Brand</h3>
          {filters.region && <button type='button' onClick={() => onChange({ region: '' })} className='text-[11px] text-[#8d7266] underline underline-offset-2 hover:text-[#a33075]'>Clear</button>}
        </div>
        {renderOptions(regions, 'region', 'regionName')}
      </section>}

      <section className='px-5 py-5' aria-label='Price range filter'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-[11px] font-bold uppercase tracking-[.15em]'>Price range</h3>
          {hasPriceFilter && <button type='button' onClick={() => onPriceChange(0, maxPrice)} className='text-[11px] text-[#8d7266] underline underline-offset-2 hover:text-[#a33075]'>Clear</button>}
        </div>
        <RangeSlider min={0} max={maxPrice} step={10} value={filters.priceRange} onChange={onPriceChange} />
      </section>
    </div>
  )

  const header = mobile ? (
    <div className='shrink-0 border-b border-[#e4d8ca] bg-[#efe3d6] px-5 py-5 pr-14'>
      <p className='text-[10px] font-semibold uppercase tracking-[.22em] text-[#a33075]'>The collection</p>
      <SheetTitle className="mt-2 text-[27px] leading-none font-normal tracking-[-.045em] text-[#30251f] [font-family:Georgia,'Times_New_Roman',serif]">Refine your find.</SheetTitle>
      <SheetDescription className='sr-only'>Choose a category, brand, and price range to filter products.</SheetDescription>
    </div>
  ) : (
    <div className='shrink-0 border-b border-[#e4d8ca] bg-[#efe3d6] px-5 py-5'>
      <p className='text-[10px] font-semibold uppercase tracking-[.22em] text-[#a33075]'>The collection</p>
      <h2 className="mt-2 text-[27px] leading-none tracking-[-.045em] [font-family:Georgia,'Times_New_Roman',serif]">Refine your find.</h2>
    </div>
  )

  const footer = (
    <div className='shrink-0 border-t border-[#e4d8ca] bg-[#fdfbf7] px-5 py-4'>
      <button type='button' onClick={onClearAll} disabled={activeCount === 0} className='w-full min-h-10 border border-[#d6c7b9] px-3 text-xs font-semibold uppercase tracking-[.1em] text-[#6b5b50] transition-colors hover:bg-[#f3eee8] disabled:cursor-not-allowed disabled:opacity-45'>Clear all {activeCount > 0 ? `(${activeCount})` : ''}</button>
      {mobile && <button type='button' onClick={onDone} className='mt-2 w-full min-h-11 bg-[#30251f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#a33075]'>Show results</button>}
    </div>
  )

  if (mobile) return <div className='flex h-full min-h-0 w-full flex-col bg-[#fdfbf7] text-[#30251f]'>{header}{sections}{footer}</div>

  return (
    <aside aria-label='Product filters' className='hidden w-[220px] shrink-0 flex-col self-start border border-[#e4d8ca] bg-[#fdfbf7] text-[#30251f] lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-7rem)] xl:w-[240px]'>
      {header}{sections}{footer}
    </aside>
  )
}

export default CatalogFilters
