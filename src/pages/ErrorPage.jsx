import { Link } from 'react-router'

function ErrorPage() {
  return (
    <main className='flex min-h-[75vh] items-center bg-[#f9f6f1] px-5 pt-28 pb-20 text-[#30251f] sm:px-8'>
      <div className='mx-auto w-full max-w-7xl border-t border-[#d8c8b8] pt-8 sm:pt-12'>
        <p className='text-[11px] font-semibold uppercase tracking-[.24em] text-[#a33075]'>A little detour · 404</p>
        <h1 className="mt-5 max-w-2xl text-[clamp(3.25rem,8vw,7rem)] leading-[.92] tracking-[-.06em] [font-family:Georgia,'Times_New_Roman',serif]">
          This page has wandered off.
        </h1>
        <p className='mt-7 max-w-md text-sm leading-7 text-[#685b51] sm:text-base'>The scent trail ends here. Head back to the collection and find something lovely.</p>
        <Link to='/shop' className='mt-9 inline-flex min-h-12 items-center justify-center bg-[#30251f] px-7 text-sm font-medium text-white transition-colors hover:bg-[#a33075]'>Explore the shop</Link>
      </div>
    </main>
  )
}

export default ErrorPage
