import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <div className='w-screen min-h-screen'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout