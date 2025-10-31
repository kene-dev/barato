import { useSignUpUserMutation } from '@/app/features/api/authApiSlice';
import supabase from '@/app/supabaseClient';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { FiEye } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

const signupSchema = z.object({
  firstName:z.string().min(1,'Please input your first name'),
  lastName:z.string().min(1,'Please input your last name'),
  email: z.string().email().min(1, "please input your email"),
  password: z.string().min(6, 'please add your password')
})

const Signup = () => {
  const [signUpUser, {isLoading}] = useSignUpUserMutation()
  const {register, handleSubmit,reset, formState:{errors,isSubmitting}} = useForm({
          resolver: zodResolver(signupSchema)
  })
  const isOnline = useSelector(state => state.persistedReducer.auth.user)
  const navigate = useNavigate()


  const onSubmit = async (formData) => {
    console.log(formData)
    try {
    const {data, error} = await supabase.auth.signUp(formData)

    if(error) throw error

    console.log(data)

    const userDetails = {
    id:data.user.id,
    email:data.user.email,
    role:'admin',
    firstName:formData.firstName,
    lastName:formData.lastName
  }

  console.log("USER DETAILS: ", userDetails)

  const {data: newUser, error:newUserError} = await signUpUser(userDetails)

  if(newUserError) throw newUserError
  
      reset()
    } catch (error) {
      console.error('Error logging in user:', error)
  }
}

useEffect(() => {
  if(isOnline){
    navigate('/')
  }
},[isOnline])


  return (
    <div className='px-5 w-screen flex flex-col justify-center items-center my-[100px] lg:flex-row gap-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full border-[1px] border-black/30 rounded-md shadow-xs p-6 md:w-[400px]'>
        <h1 className='font-semibold text-2xl mb-1'>Create Account</h1>
        <p className='text-xs text-gray-500 mb-5'>Please register your details</p>
        <div className='flex flex-col gap-7'>
          <input {...register('firstName')} className='border border-gray rounded-sm shadow-xs h-10 p-3 placeholder:text-xs ' type="text" name="firstName" id="" placeholder='First Name' />
           {errors.firstName && (<p className="-mt-5 text-red-500 text-sm">{errors.firstName.message}</p>)}


          <input {...register('lastName')} className='border border-gray rounded-sm shadow-xs h-10 p-3 placeholder:text-xs' type="text" name='lastName' id='' placeholder='Last Name' />
           {errors.lastName && (<p className="-mt-5 text-red-500 text-sm">{errors.lastName.message}</p>)}

          <input {...register('email')} className='border border-gray rounded-sm shadow-xs h-10 p-3 placeholder:text-xs' type="email" name="email" placeholder='Email' />
          {errors.email && (<p className="-mt-5 text-red-500 text-sm">{errors.email.message}</p>)}

          <div className='relative'>
            <input {...register('password')} className='w-full border border-gray rounded-sm shadow-xs h-10 p-3 placeholder:text-xs' type="text" name="password" id="" placeholder='Password' />
            <FiEye className='absolute right-5 top-3'/>
          </div>
            {errors.password && (<p className="-mt-5 text-red-500 text-sm">{errors.password.message}</p>)}


          <button className='bg-primary rounded-sm shadow-lg h-10 text-white flex items-center justify-center font-semibold mb-6'>
            {isLoading ? (<div className='loader'></div>) : "Sign up"}
           
          </button>
        </div>
      </form>
      <div className='w-full md:w-[300px] flex justify-center items-center flex-col gap-2'>
        <h1 className='text-md font-semibold '>Already Have An Account</h1>
        <Link className='w-full' to='/auth'>
          <button className='border border-primary shadow-sm rounded-md w-full h-10 text-primary font-semibold text-sm'>Log in</button>
        </Link>
        <p className='text-center text-xs lg:text-sm p-2'>Your privacy and security are important to us. For more information on how we use your data read our</p>
        <p className='text-xs text-primary font-semibold lg:text-sm'>Privacy Policy.</p>
      </div>
    </div>
  )
}

export default Signup