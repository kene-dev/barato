import { useGetUserQuery } from '@/app/features/api/authApiSlice'
import Sidebar from '@/components/admin/Sidebar'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

const AdminLayout = () => {
  const userId = useSelector(state => state.persistedReducer.auth.user)
  const { data: user, isLoading } = useGetUserQuery(userId?.id, { skip: !userId?.id })

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f7f2ec]"><div className="loader-primary" /></div>
  }
  if (user?.[0]?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-[#f7f2ec] text-[#30251f] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden lg:block"><Sidebar /></aside>
      <div className="min-w-0">
        <div className="lg:hidden"><Sidebar compact /></div>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-7 lg:px-10 lg:py-10"><Outlet /></main>
      </div>
    </div>
  )
}

export default AdminLayout
