import { useSignInUserMutation } from '@/app/features/api/authApiSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FiEye } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string()
    .nonempty("please input your email")
    .email("please enter a valid email address"),
  password: z.string().min(6, 'please add your password')
})

const Login = () => {
  const [signInUser, {isLoading}] = useSignInUserMutation()
  const {register, handleSubmit,reset, formState:{errors}} = useForm({
        resolver: zodResolver(signInSchema)
  })
  const [hide, setHide] = useState(true);
  const navigate = useNavigate()
  const isOnline = useSelector(state => state.persistedReducer.auth.user)


  const onSubmit = async (formData) => {
      try {
     await signInUser(formData).unwrap();
      reset()
    } catch (error) {
      toast.error(error.data)
      console.error('Error logging in user:', error)
    }
}

useEffect(() => {
  if(isOnline){
    navigate('/')
  }
},[isOnline, navigate])


  return (
    <div className='min-h-[calc(100vh-5rem)] w-full bg-[#f9f6f1] px-5 pt-32 pb-16 flex flex-col justify-center items-center lg:flex-row gap-8'>

      <form onSubmit={handleSubmit(onSubmit)} className='border border-[#e3d7c9] bg-white p-7 shadow-[6px_6px_0_#e5d5c5] w-full md:w-[400px]'>
        <h1 className="mb-2 text-3xl tracking-[-.04em] text-[#30251f] [font-family:Georgia,'Times_New_Roman',serif]">Login</h1>
        <p className='text-xs text-gray-500 mb-5'>Please login below</p>
        <div className='flex flex-col gap-7'>
          <input {...register('email')} className='min-h-12 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none placeholder:text-[#92877e] focus:border-[#a33075]' type="text" placeholder='Email' />
          {errors.email && (<p className="-mt-5 text-red-500 text-sm">{errors.email.message}</p>)}


          <div className='relative'>
            <input {...register('password')} className='min-h-12 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none placeholder:text-[#92877e] focus:border-[#a33075]' type={hide ? 'password' : "text"} placeholder='Password' />
            <FiEye onClick={() => setHide(!hide)} className='absolute right-5 top-3 eye-icon'/>
          </div>
          {errors.password && (<p className="-mt-5 text-red-500 text-sm">{errors.password.message}</p>)}

          <button className='flex min-h-12 items-center justify-center bg-[#30251f] px-5 text-sm font-semibold text-white hover:bg-[#50372f]'>
            {isLoading ? (<div className='loader'></div> ) : 'Sign in'}
          </button>

          <Link to="forgot-password" className='text-primary text-center'>Forgot Your Password?</Link>
        </div>
      </form>


      <div className='w-full flex justify-center items-center flex-col gap-2 md:w-[300px]'>
        <h1 className='text-md font-semibold '>Don’t Have An Account?</h1>
        <Link  className='flex items-center justify-center border border-primary shadow-sm rounded-md w-full h-10 text-primary font-semibold text-sm' to='/auth/register'>
          Create Account
        </Link>
        <p className='text-center text-xs lg:text-sm px-2'>Your privacy and security are important to us. For more information on how we use your data read our</p>
        <p className='text-xs text-primary font-semibold lg:text-sm'>Privacy Policy.</p>
      </div>
    </div>
  )
}

export default Login
