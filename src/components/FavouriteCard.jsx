import React, { useEffect, useOptimistic, useState } from 'react'
import addCart from '../assets/addCart.svg'
import view from '../assets/view.svg'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/app/features/cartSlice'
import { useRemoveFromWishlistMutation } from '@/app/features/api/wishlistApiSlice'
import { toast } from 'react-toastify';
import { GoTrash } from "react-icons/go";

const FavouriteCard = ({productImage, productName, productPrice, discountedPrice, id}) => {
    const dispatch = useDispatch()
    const [removeFromWishlist] = useRemoveFromWishlistMutation()
    const handleRemoveFromWishlist = async () => {
               try {
                await removeFromWishlist({ product_id: id }).unwrap();
                toast.success('Removed from your wishlist');
            } catch (error) {
                // Revert on error
                setOptimisticFavourite(!optimisticFavourite);
                toast.error("Operation failed. Please try again.");
            }      
    }


  return (
     <div  className='w-full md:w-[242px] lg:h-[307.26px] h-[330px] bg-white border-[1px] border-black/30 drop-shadow-md relative group'>
      <div onClick={(e) => e.stopPropagation()}>
          <Link to={`/shop/${id}`}>
          <div  className='w-full lg:h-[230px]'>
              <img src={productImage} className='w-full lg:h-full h-[260px] object-contain '/>
          </div>
          </Link>
          <div className='w-full text-center'>
              <h1 className='font-semibold'>{productName}</h1>
              <p className='text-sm'>₦{productPrice?.toFixed(2)} <span className='text-primary line-through'>₦{(productPrice + discountedPrice)?.toFixed(2)}</span></p>
          </div>
          <div  className='lg:opacity-0 flex flex-col items-center justify-between gap-1 absolute  top-16 group-hover:lg:right-3 lg:-right-3 right-3 group-hover:opacity-100 duration-500 ease-out '>
              <img onClick={() => dispatch(addToCart({productImage, productName, productPrice, id}))} src={addCart} className='w-10' /> 

                <div className='w-8 h-8 p-2 bg-white shadow-md shadow-black/50 rounded-full'>
                    <GoTrash onClick={handleRemoveFromWishlist} className='w-full h-full text-primary' />
                </div>
               
              <Link to={`/shop/${id}`} className='w-10 rounded-full'>
                <img src={view} className='w-full' />
              </Link>
          </div>
      </div>
  </div>
  )
}

export default FavouriteCard