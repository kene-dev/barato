import React, { useEffect, useOptimistic, useState } from 'react'
import soy from '../assets/soy.png'
import favourite from '../assets/favourite.svg'
import addCart from '../assets/addCart.svg'
import { FaHeart } from "react-icons/fa";
import view from '../assets/view.svg'
import liked from '../assets/liked.svg'
import { Link, redirect, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/app/features/cartSlice'
import { useAddToWishlistMutation, useCheckInWishlistQuery, useRemoveFromWishlistMutation } from '@/app/features/api/wishlistApiSlice'
import { toast } from 'react-toastify';

const ProductCard = ({productImage, productName, productPrice, discountedPrice, id}) => {
    const user = useSelector(state => state.persistedReducer.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [addToWishlist,] = useAddToWishlistMutation()
    const [removeFromWishlist] = useRemoveFromWishlistMutation()

    // Fixed wishlist query with skip option
    const { data: isFavoured, refetch } = useCheckInWishlistQuery(
        { product_id: id }, 
        { skip: !user }
    );

    const [optimisticFavourite, setOptimisticFavourite] = useState(false)


  const handleAddToWishlist = async () => {

         if(!user) {
                setOptimisticFavourite(false);
                toast.error('Please login to manage your wishlist')
                return
            }
           try {
        if (!optimisticFavourite) {
            setOptimisticFavourite(true);
            await addToWishlist({ product_id: id, user_id:user.id }).unwrap();
            toast.success('Added to your wishlist');
        } else {
            setOptimisticFavourite(false);
            await removeFromWishlist({ product_id: id }).unwrap();
            toast.success('Removed from your wishlist');
        }
        refetch();
        } catch (error) {
            // Revert on error

            setOptimisticFavourite(false);
            toast.error("Operation failed. Please try again.", error);
        }
           
    }

    // Sync optimistic state with query data
  useEffect(() => {
    if (isFavoured !== undefined) {
      setOptimisticFavourite(isFavoured);
    }
  }, [isFavoured]);
 
  return (
    <div  className='w-full md:w-[242px] lg:h-[307.26px] h-[330px] bg-white border-[1px] border-black/30 drop-shadow-md relative group'>
      <div onClick={(e) => e.stopPropagation()}>
          <Link to={`/shop/${id}`}>
          <div  className='w-full lg:h-[230px]'>
              <img src={productImage} className='w-full lg:h-full h-[260px] object-cover'/>
          </div>
          </Link>
          <div className='w-full text-center'>
              <h1 className='font-semibold'>{productName}</h1>
              <p className='text-sm'>₦{productPrice?.toFixed(2)} <span className='text-primary line-through'>₦{(discountedPrice ?? 0)?.toFixed(2)}</span></p>
          </div>

          {/* <div  className='lg:opacity-0 flex flex-col items-center justify-between gap-1 absolute  top-16 group-hover:lg:right-3 lg:-right-3 right-3 group-hover:opacity-100 duration-500 ease-out '>
              <img onClick={() => dispatch(addToCart({productImage, productName, productPrice, id}))} src={addCart} className='w-10' /> 
              {optimisticFavourite ? 
                ( 
                <img onClick={handleAddToWishlist} src={liked} className='w-10' />
                ): (
                <img onClick={handleAddToWishlist} src={favourite} className='w-10' />
              )}
              <img src={view} className='w-10 rounded-full' />
          </div> */}
      </div>
  </div>
  ) 
}

export default ProductCard