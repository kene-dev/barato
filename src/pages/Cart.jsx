import { Button } from '@/components/ui/button'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { GoTrash } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { decrementItem, incrementItem, removeFromCart, selectCartItems, selectCartTotal } from '@/app/features/cartSlice';

const Cart = () => {
    const cartItems = useSelector(selectCartItems)
    const cartTotal = useSelector(selectCartTotal)
    const dispatch = useDispatch()

    const proceedToCheckout = () => {
        if (cartItems.length > 0) {
            // Create WhatsApp message with cart items
            const itemList = cartItems.map(item => 
                `*${item.productName}* - Qty: ${item.quantity} - ₦${item.productPrice * item.quantity}`
            ).join('\n')
            
            const message = encodeURIComponent(
                `Hello! I would like to place an order:\n\n${itemList}\n\nTotal: ₦${parseFloat(cartTotal).toFixed(2)}`
            )
            
            // WhatsApp number: +234 806 011 9051
            const whatsappNumber = '2348060119051'
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
            
            // Open WhatsApp on mobile or web
            window.open(whatsappUrl, '_blank')
        }
    }


  return (
    <div className='w-screen 2xl:w-[80%] mx-auto flex flex-col lg:flex-row items-start gap-5 lg:px-10 lg:py-10 my-20'>

        <div className='w-full lg:w-max flex grow overflow-x-scroll lg:px-0 px-5'>
            {cartItems && cartItems.length > 0  ? (
            <Table className='lg:w-full w-[600px]'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Product</TableHead>
                        <TableHead className=''>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {cartItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell colSpan={1} className="flex items-center gap-4 lg:gap-7">
                                <img className='w-[89px] lg:h-[89.31px] h-[79.31px]' src={item.productImage} />
                                <p className='text-wrap'>{item.productName}</p>
                            </TableCell>

                            <TableCell className='w-[150px] md:w-fit'>
                                <div className='mt-3 flex justify-between items-center'>
                                    <div className='flex items-center justify-center border border-black/50 rounded-xs'>

                                        <p onClick={() => dispatch(decrementItem(item.id))} className='flex items-center justify-center hover:bg-primary hover:text-white w-8 h-8 text-xl  cursor-pointer'>-</p>

                                        <p className='border-l border-black/50 flex items-center justify-center w-10 h-8 lg:text-xl'>{item.quantity}</p>

                                        <p onClick={() => dispatch(incrementItem(item.id))} className='border-l border-black/50 flex items-center justify-center hover:bg-primary hover:text-white w-8 h-8 text-xl text-black cursor-pointer'>+</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell colSpan={2} className='text-wrap w-max overflow-x-scroll'>₦{item.productPrice * item.quantity}</TableCell>
                            <TableCell className='md:w-fit'><GoTrash onClick={() => dispatch(removeFromCart(item.id))} className='text-primary w-5 h-5' /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            ):(
                <div className='w-full h-full flex items-center justify-center text-2xl font-semibold'>
                    Your cart is empty
                </div>
            )}
           
        </div>

        <div className='lg:w-[405px] w-[90%] mx-auto h-max flex flex-col gap-8 drop-shadow-md shadow-md rounded-md p-4 py-8 text-center'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold lg:text-2xl'>Subtotal</h1>
                <p className='lg:text-xl'>₦{parseFloat(cartTotal).toFixed(2)}</p>
            </div>

            
            <p>Taxes and shipping calculated at checkout</p>
            <Button onClick={proceedToCheckout} className='w-full h-[58px] lg:text-xl font-semibold'>
                Checkout on WhatsApp
            </Button>
        </div>
    </div>
  )
}

export default Cart