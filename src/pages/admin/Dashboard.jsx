import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Boxes, Layers3, Tags } from 'lucide-react'
import { useGetAdminProductsQuery } from '@/app/features/api/productApiSlice'
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice'
import { useGetRegionsQuery } from '@/app/features/api/regionsApiSlice'
import { useGetSalesBannerQuery, useSaveSalesBannerMutation } from '@/app/features/api/salesBannerApiSlice'

const Dashboard = () => {
  const { data: salesBanner, isLoading: loadingBanner, isError: bannerLoadError, refetch: refetchBanner } = useGetSalesBannerQuery(undefined, { refetchOnMountOrArgChange: true })
  const [saveBanner, { isLoading: savingBanner }] = useSaveSalesBannerMutation()
  const [bannerDraft, setBannerDraft] = useState({ headline: '', description: '' })
  const [bannerSaved, setBannerSaved] = useState(false)
  const [bannerError, setBannerError] = useState('')
  const { data: products, isLoading: loadingProducts } = useGetAdminProductsQuery({ searchTerm: '', page: 1, pageSize: 1 })
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery({ searchTerm: '' })
  const { data: brands, isLoading: loadingBrands } = useGetRegionsQuery({ searchTerm: '' })

  useEffect(() => {
    if (salesBanner) {
      setBannerDraft({
        headline: salesBanner.headline ?? '',
        description: salesBanner.description ?? '',
      })
    }
  }, [salesBanner])

  const sections = [
    { title: 'Products', value: products?.totalCount, loading: loadingProducts, detail: 'Manage prices, images and listings', to: '/admin/products', icon: Boxes },
    { title: 'Categories', value: categories?.length, loading: loadingCategories, detail: 'Shape how shoppers browse', to: '/admin/categories', icon: Layers3 },
    { title: 'Brands', value: brands?.length, loading: loadingBrands, detail: 'Keep the brand list current', to: '/admin/regions', icon: Tags },
  ]

  const saveSalesBanner = async (event) => {
    event.preventDefault()
    const headline = bannerDraft.headline.trim()
    const description = bannerDraft.description.trim()
    if (!headline || !description) return
    setBannerError('')
    try {
      await saveBanner({ headline, description }).unwrap()
      setBannerDraft({ headline, description })
      setBannerSaved(true)
    } catch (error) {
      setBannerSaved(false)
      setBannerError(error?.message || 'Could not save the banner. Please try again.')
    }
  }

  return (
    <div>
      <header className="mb-9 border-b border-[#dfd2c5] pb-8">
        <p className="mb-3 text-[11px] font-semibold tracking-[.22em] uppercase text-[#a33075]">Matrix Scents / Admin studio</p>
        <h1 className="text-4xl leading-tight tracking-[-.045em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Your store, at a glance.</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[#776b60]">A simple place to keep your collection organised.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {sections.map(({ title, value, loading, detail, to, icon: Icon }, index) => (
          <Link key={to} to={to} className="group flex min-h-56 flex-col border border-[#e5d8ca] bg-white p-6 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#a33075]">
            <div className="flex items-start justify-between">
              <span className="grid size-11 place-items-center bg-[#f6e9f1] text-[#a33075]"><Icon size={20} /></span>
              <span className="text-xs text-[#aa9989]">0{index + 1}</span>
            </div>
            <p className="mt-7 text-4xl tracking-[-.05em] [font-family:Georgia,'Times_New_Roman',serif]">{loading ? '…' : value ?? '—'}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-[#776b60]">{detail}</p></div>
              <ArrowUpRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-l-4 border-[#f83dbe] bg-[#eee3d8] px-6 py-5">
        <p className="text-[11px] font-semibold tracking-[.17em] uppercase text-[#a33075]">Quick start</p>
        <p className="mt-2 text-sm leading-6">Adding a new scent? Head to Products to create its listing and upload its image.</p>
      </div>
      <section className='mt-8 border border-[#e5d8ca] bg-white p-5 sm:p-7' aria-labelledby='sales-banner-editor'>
        <div className='flex flex-wrap items-start justify-between gap-4 border-b border-[#e5d8ca] pb-5'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[.19em] text-[#a33075]'>Storefront message</p>
            <h2 id='sales-banner-editor' className="mt-2 text-3xl tracking-[-.045em] [font-family:Georgia,'Times_New_Roman',serif]">Sales banner</h2>
            <p className='mt-2 max-w-xl text-sm leading-6 text-[#776b60]'>Edit the headline and supporting text shown at the top of the Sales page.</p>
          </div>
          <Link to='/sales' className='inline-flex min-h-10 items-center gap-2 border border-[#d8c9ba] px-4 text-xs font-medium transition-colors hover:bg-[#f7f2ec]'>View Sales page <ArrowUpRight size={16} aria-hidden='true' /></Link>
        </div>
        {loadingBanner ? <p role='status' className='mt-6 text-sm text-[#776b60]'>Loading banner text…</p> : bannerLoadError ? (
          <div role='alert' className='mt-6 flex flex-wrap items-center gap-3 text-sm text-[#8f215f]'>Could not load the banner from Supabase. <button type='button' onClick={refetchBanner} className='underline underline-offset-2'>Try again</button></div>
        ) : <form onSubmit={saveSalesBanner} className='mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.75fr)] lg:gap-8'>
          <div className='space-y-5'>
            <div>
              <label htmlFor='sales-banner-headline' className='mb-2 block text-xs font-semibold uppercase tracking-[.1em]'>Headline</label>
              <input id='sales-banner-headline' type='text' required maxLength={80} value={bannerDraft.headline} onChange={event => { setBannerDraft(previous => ({ ...previous, headline: event.target.value })); setBannerSaved(false) }} className='min-h-12 w-full border border-[#d8c9ba] bg-[#fdfbf8] px-4 text-sm outline-none focus:border-[#a33075]' />
            </div>
            <div>
              <label htmlFor='sales-banner-description' className='mb-2 block text-xs font-semibold uppercase tracking-[.1em]'>Description</label>
              <textarea id='sales-banner-description' required maxLength={220} rows={4} value={bannerDraft.description} onChange={event => { setBannerDraft(previous => ({ ...previous, description: event.target.value })); setBannerSaved(false) }} className='w-full resize-y border border-[#d8c9ba] bg-[#fdfbf8] px-4 py-3 text-sm leading-6 outline-none focus:border-[#a33075]' />
            </div>
            <div className='flex flex-wrap items-center gap-4'>
              <button type='submit' disabled={savingBanner} className='min-h-11 bg-[#30251f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#a33075] disabled:cursor-wait disabled:opacity-60'>{savingBanner ? 'Saving…' : salesBanner ? 'Update banner text' : 'Create banner text'}</button>
              {bannerSaved && <p role='status' className='text-xs text-[#6c6056]'>Saved to Supabase.</p>}
              {bannerError && <p role='alert' className='text-xs text-[#a33075]'>{bannerError}</p>}
            </div>
          </div>
          <div className='self-start border border-[#462835] bg-[#39212c] p-6 text-[#fff7ee]'>
            <p className='text-[10px] font-semibold uppercase tracking-[.18em] text-[#f2b7d7]'>Live preview</p>
            <p className="mt-5 break-words text-3xl leading-tight tracking-[-.045em] [font-family:Georgia,'Times_New_Roman',serif]">{bannerDraft.headline || 'Your headline'}</p>
            <p className='mt-4 break-words text-xs leading-6 text-[#ead8d0]'>{bannerDraft.description || 'Your description'}</p>
          </div>
        </form>}
      </section>
    </div>
  )
}

export default Dashboard
