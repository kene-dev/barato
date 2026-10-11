import { useState } from 'react'
import { z } from 'zod'
import { FiEye } from "react-icons/fi";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useResetPasswordMutation } from '@/app/features/api/authApiSlice';

const resetPasswordSchema = z.object({
  password: z.string().min(8, "password must have at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword,  {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

const ResetPassword = () => {
  const [resetPassword, {isLoading}] = useResetPasswordMutation()
  const [show, setShow] = useState(false)

   const {register, handleSubmit, formState:{errors}} = useForm({
        resolver: zodResolver(resetPasswordSchema)
    })

    const onSubmit = async (data) => {
      console.log(data)
      const password = data.password;
      try {
        const response = await resetPassword({password}).unwrap()
        console.log(response)
      } catch (error) {
        console.log(error)
      }

    }


  return (
    <div className='min-h-[calc(100vh-5rem)] w-full bg-[#f9f6f1] px-5 pt-32 pb-16 flex justify-center items-center'>
    <form onSubmit={handleSubmit(onSubmit)} className='w-full border border-[#e3d7c9] bg-white p-7 shadow-[6px_6px_0_#e5d5c5] md:w-[400px]'>

        <h1 className="mb-2 text-3xl tracking-[-.04em] text-[#30251f] [font-family:Georgia,'Times_New_Roman',serif]">Reset Password</h1>
        <p className='text-xs text-gray-500 mb-5'>Kindly input your new password</p>

        <div className='flex flex-col gap-7'>
          <div className='relative'>
            <input {...register('password')} className='min-h-12 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none placeholder:text-[#92877e] focus:border-[#a33075]' type={show ? 'text' : 'password'} name="password" placeholder='Password' />
            <FiEye onClick={() => setShow(!show)} className='absolute right-5 top-3'/>
          </div>
           {errors.password && (<p className="-mt-5 text-red-500 text-sm">{errors.password.message}</p>)}

          <div className='relative'>
            <input {...register('confirmPassword')} className='min-h-12 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none placeholder:text-[#92877e] focus:border-[#a33075]'  type={show ? 'text' : 'password'} name="confirmPassword" placeholder='Confirm Password' />
            <FiEye onClick={() => setShow(!show)} className='absolute right-5 top-3'/>
          </div>
          {errors.confirmPassword && (<p className="-mt-5 text-red-500 text-sm">{errors.confirmPassword.message}</p>)}

        <button disabled={isLoading} className='min-h-12 bg-[#30251f] px-5 text-sm font-semibold text-white hover:bg-[#50372f] disabled:opacity-50'>{isLoading ? 'Updating…' : 'Submit'}</button>
      </div>

    </form>
  </div>
  )
}

export default ResetPassword
