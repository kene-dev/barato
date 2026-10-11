import { useGetUserQuery } from '@/app/features/api/authApiSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { MdEmail } from "react-icons/md";
import OrdersList from '@/components/OrdersList';
import FavouritesList from '@/components/FavouritesList';
import ShippingList from '@/components/ShippingList';

const tabs = [
    'orders',
    'favourites',
    'shipping Address'
]

const ProfilePage = () => {
    const userId = useSelector(state => state.persistedReducer.auth.user)
    const {data:user} = useGetUserQuery(userId?.id);
    const [currentTab, setCurrentTab] = useState('orders')

    const renderView = () => {
        switch (currentTab) {
            case 'orders':
                return <OrdersList /> 
            case 'favourites':
                return <FavouritesList />
            case 'shipping Address':
                return <ShippingList />
            default:
                return <OrdersList /> ;
        }
    }



  return (
     <main className='mx-auto flex min-h-screen w-full max-w-7xl flex-col items-start gap-7 bg-[#f9f6f1] px-5 pt-32 pb-16 text-[#30251f] sm:px-8 lg:flex-row lg:px-10'>
        <div className='w-full lg:max-w-[300px] border border-[#e3d7c9] bg-white p-6 flex flex-col gap-7 items-start' >
            {user ? (
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className='w-[100px] h-[100px] rounded-full bg-primary text-white text-4xl font-bold flex items-center justify-center gap-1'>
                        <p>{user[0]?.firstName?.slice(0,1)}</p>
                        <p>{user[0]?.lastName?.slice(0,1)}</p>
                    </div>

               
                    <div className='flex items-center gap-2 text-3xl font-semibold'>
                        {/* <img src={account} alt="" /> */}
                        <h1>{user[0]?.firstName}</h1>
                        <h1>{user[0]?.lastName}</h1>
                    </div>

                    <div className='flex items-center gap-2'>
                        <MdEmail className='w-4 h-4 text-primary' />
                        <p>{user[0]?.email}</p>
                    </div>
               
                </div>
                ): (
                <div> Fetching User info </div>
            )}
            

            {tabs?.map((tab, idx) => (
                <div key={idx} onClick={() => setCurrentTab(tab)}  className={`${tab === currentTab && '!bg-[#30251f] text-white font-semibold'} w-full min-h-11 bg-[#f4eee8] hover:bg-[#30251f] capitalize hover:text-white text-center flex items-center justify-start gap-5 px-5 cursor-pointer`}>
                    {tab}
                </div>
            ))}
        </div>

        <div className='min-w-0 w-full flex-grow'>
            {renderView()}
        </div>
     </main>
  )
}

export default ProfilePage
