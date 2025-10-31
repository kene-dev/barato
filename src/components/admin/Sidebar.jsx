import React from 'react'
import logo from '../../assets/logo.png';
import { adminNavLinks } from '@/lib/navLinks';
import { Link, useLocation } from 'react-router';

const Sidebar = () => {
    const {pathname} = useLocation()
  return (
    <div className='w-[356px] h-screen bg-white drop-shadow-lg rounded-[10px] flex flex-col gap-10 items-start lg:px-5 2xl:px-10 '>
        <Link to='/'>
            <img src={logo} className='w-[170px] my-3 ' />
        </Link>
    
        <hr className='bg-black h-[1px] w-full -mt-4' />
        <div className='w-full'>
            {adminNavLinks.map(link => (
                <Link key={link.name} to={link.path} className={`${pathname === link.path && 'bg-primary text-white' } w-full h-[61px] my-4 hover:bg-primary hover:text-white rounded-lg text-center flex items-center justify-start  gap-5 shadow-lg px-10`}>
                    {<link.icon />}
                    {link.name}
                </Link>
            ))}
        </div>

    </div>
  )
}

export default Sidebar