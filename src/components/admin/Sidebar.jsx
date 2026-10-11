import { adminNavLinks } from '@/lib/navLinks'
import { Link, useLocation } from 'react-router'
import logo from '../../assets/logo.png'

// eslint-disable-next-line react/prop-types
const Sidebar = ({ compact = false }) => {
  const { pathname } = useLocation()

  return (
    <nav aria-label="Admin navigation" className={compact ? 'w-full overflow-x-auto border-b border-[#e8ddd2] bg-white px-4 py-3' : 'flex h-full w-full flex-col border-r border-[#e8ddd2] bg-[#faf7f2] px-5 py-7'}>
      {!compact && (
        <Link to="/" className="mb-12 inline-flex w-max flex-col gap-3 px-3 focus-visible:outline-2 focus-visible:outline-[#a33075]">
          <span className="flex items-center gap-3"><img src={logo} alt="" className="size-12 object-contain" /><span className="text-sm font-semibold tracking-wide text-[#30251f]">Matrix Scents</span></span>
          <span className="text-[10px] font-semibold tracking-[.22em] uppercase text-[#9a766e]">Admin studio</span>
        </Link>
      )}
      <div className={compact ? 'flex min-w-max gap-2' : 'flex flex-col gap-2'}>
        {adminNavLinks.map(link => {
          const active = pathname === link.path
          const Icon = link.icon
          return (
            <Link key={link.path} to={link.path} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#a33075] ${active ? 'bg-[#30251f] text-white' : 'text-[#63574e] hover:bg-[#eee7df] hover:text-[#30251f]'}`}>
              <Icon size={18} aria-hidden="true" />{link.name}
            </Link>
          )
        })}
      </div>
      {!compact && <p className="mt-auto border-t border-[#ded2c6] pt-5 text-xs text-[#9a766e]">A little care in every detail.</p>}
    </nav>
  )
}

export default Sidebar
