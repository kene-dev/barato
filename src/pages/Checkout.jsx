import { useAddAddressMutation, useGetAddressQuery } from '@/app/features/api/shippingApiSlice';
import { selectCartItems, selectCartTotal, removeFromCart, clearCart } from '@/app/features/cartSlice';
import ShippingSelector from '@/components/ShippingSelector';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { GoTrash } from "react-icons/go";
import { Link, useNavigate } from 'react-router';
import { useCreateOrderMutation } from '@/app/features/api/orderApiSlice';
import { toast } from 'react-toastify';


const addShippingSchema = z.object({
  street:z.string().min(1,'Please input your street name'),
  city:z.string().min(1,'Please input your city'),
  state: z.string().min(1, "Please input your state"),
  country: z.string().min(1, 'Please add your country'),
  saveShipping: z.boolean(),
})
const formFields = ['street', 'city', "state", 'country']

const Checkout = () => {
    const cartItems = useSelector(selectCartItems)
    const cartTotal = useSelector(selectCartTotal)
    const {id:user_id} = useSelector(state => state.persistedReducer.auth.user)
    const {data:shippingData} = useGetAddressQuery();
    const [addAddress] = useAddAddressMutation()
    const [createOrder] = useCreateOrderMutation()
    const [selectedAddress, setSelectedAddress] = useState(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

     const {register, setValue, watch, handleSubmit,reset, formState:{errors, isSubmitting}} = useForm({
            resolver: zodResolver(addShippingSchema)
    })

    const saveShipping = watch("saveShipping");

    const handleAddressSelection = (address) => {
        if(selectedAddress && selectedAddress.id === address.id){
            setSelectedAddress(null)
            reset()
        }else{
            setSelectedAddress(address)
            setValue('street', address.street)
            setValue('city', address.city)
            setValue('state', address.state)
            setValue('country', address.country)
        }
    }

    const onSubmit = async (formData) => {
            console.log(formData)
      try {
        if(formData.saveShipping){
            const shippingDetails = {
                user_id,
                street:formData.street,
                city:formData.city,
                state:formData.state,
                country:formData.country
            }    
            const newAddress = await addAddress(shippingDetails).unwrap()
            const result = await createOrder({user_id, shipping_address_id:newAddress[0].id, cartItems, cartTotal }).unwrap()
            console.log(result)
            dispatch(clearCart())
            navigate('/profile')
        }else if(!formData.saveShipping && !selectedAddress){
             const temp_address = {
                street:formData.street,
                city:formData.city,
                state:formData.state,
                country:formData.country
            }    
            const result = await createOrder({user_id, shipping_address_id:null, cartItems, cartTotal, temp_address }).unwrap()
            console.log(result)
            dispatch(clearCart())
            navigate('/profile')
        }else{
             const result = await createOrder({user_id, shipping_address_id:selectedAddress.id, cartItems, cartTotal }).unwrap()
             console.log(result)
             dispatch(clearCart())
             navigate('/profile')
        }
        } catch (error) {
            toast.error('Error creating order:', error)
            console.error('Error creating order:', error)
      }
    }

  return (
    <div className='w-screen 2xl:w-[80%] mx-auto h-max lg:h-screen lg:p-10 p-5'>
        <div className='w-full flex flex-col lg:flex-row items-center gap-3'>
            {shippingData && shippingData.length > 0 && shippingData.map(item => (
                <ShippingSelector action={handleAddressSelection} selectedAddress={selectedAddress} {...item}  key={item.id}/>
            ))}
        </div>
        
        <div className='w-full h-full flex flex-col lg:flex-row gap-10 my-10'>
            <div className='lg:max-w-[475px] w-full h-max'>
                 <form onSubmit={handleSubmit(onSubmit)} className='w-full h-max'>
                    <h1 className='mb-7 text-2xl text-primary'>Shipping Details</h1>
                    
                    <div className='flex flex-col gap-1 w-full my-3'>
                        <label>Street Address</label>
                        <input {...register(`street`)} type='text' disabled={selectedAddress} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                        {errors.street && (<p className="mt-2 text-red-500 text-sm">{errors.street.message}</p>)}
                    </div>

                    <div className='flex flex-col gap-1 w-full my-3'>
                        <label>City</label>
                        <input {...register(`city`)} type='text' disabled={selectedAddress} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                        {errors.city && (<p className="mt-2 text-red-500 text-sm">{errors.city.message}</p>)}
                    </div>

                    <div className='lg:flex items-center gap-3 w-full'>
                        {formFields.slice(2).map(field => (
                            <div key={field} className='flex flex-col gap-1 w-full my-3'>
                                <label>{field}</label>
                                <input {...register(field)} type='text' disabled={selectedAddress} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                                {errors[field] && (<p className="mt-2 text-red-500 text-sm">{errors[field].message}</p>)}
                            </div>
                        ))}
                    </div>

                    {!selectedAddress && shippingData?.length <= 4 && (
                        <span className='flex md:items-center space-x-1 md:space-x-2 w-full'>
                            <input className='accent-just-red size-4 cursor-pointer mt-[2px] md:mt-0' type='checkbox' checked={saveShipping} {...register("saveShipping")} />
                            <p className='text-sm md:text-sm'>Save this information for faster check-out next time</p>
                        </span>
                        )
                    }
               
                    <Button className='w-full h-[50px] lg:text-xl flex items-center justify-center font-semibold my-5'>
                       {isSubmitting ? (<div className='loader'></div> ) : 'Process Order'}
                    </Button>
                  
                </form>
            </div>
            
            {/* TOTAL AND SHIPPING COST */}
            <div className='w-full h-full'>
                <div className='w-full overflow-x-scroll lg:w-full max-h-[500px] flex flex-col items-start gap-4'>
                    <Table className='lg:w-full h-full w-[600px]'>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className="text-black">Product</TableHead>
                                <TableHead className='text-black'>Quantity</TableHead>
                                <TableHead className='text-black'>Total</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {cartItems && cartItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell colSpan={1} className="flex items-center gap-4 lg:gap-7">
                                        <img className='w-[89px] lg:h-[89.31px] h-[79.31px]' src={item.productImage} />
                                        <p className='text-wrap'>{item.productName}</p>
                                    </TableCell>

                                    <TableCell className='w-[150px] md:w-fit'>
                                        {item.quantity}
                                    </TableCell>

                                    <TableCell colSpan={2} className='text-wrap w-max overflow-x-scroll'>₦{item.productPrice * item.quantity}</TableCell>

                                    <TableCell className='md:w-fit'><GoTrash onClick={() => dispatch(removeFromCart(item.id))} className='text-primary w-5 h-5' /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className='w-full h-max flex flex-col items-start  gap-4 p-5'>
                        <hr className='w-full border-[1px] border-black/20'/>

                        <div className='w-full flex items-center justify-between'>
                            <h1 className='font-semibold lg:text-xl'>Shipping</h1>
                            <p className='lg:text-xl'>FREE</p>
                        </div>

                        <hr className='w-full border-[1px] border-black/20'/>
                            <div className='w-full flex items-center justify-between'>
                                <h1 className='font-semibold lg:text-xl'>Total</h1>
                                <p className='lg:text-xl'>₦{parseFloat(cartTotal).toFixed(2)}</p>
                            </div>
                        <hr />
                    </div>

                </div>
            </div>
        </div>

    </div>
  )
}

export default Checkout