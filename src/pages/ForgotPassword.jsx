import { useForgotPasswordMutation } from '@/app/features/api/authApiSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email().min(1, "please input your email"),
})

const ForgotPassword = () => {
  const [forgotPassword, {isLoading}] = useForgotPasswordMutation()

  const {register, handleSubmit, formState:{errors}} = useForm({
          resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data) => {
    const email = data.email
    console.log(email)
    try {
      const response = await forgotPassword({email}).unwrap()
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='min-h-[calc(100vh-5rem)] w-full bg-[#f9f6f1] px-5 pt-32 pb-16 flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)}  className='w-full border border-[#e3d7c9] bg-white p-7 shadow-[6px_6px_0_#e5d5c5] lg:w-[400px]'>

        <h1 className="mb-2 text-3xl tracking-[-.04em] text-[#30251f] [font-family:Georgia,'Times_New_Roman',serif]">Forgot Password</h1>
        <p className='text-xs text-gray-500 mb-5'>We will send you an email to reset your passwords</p>
        <div className='flex flex-col gap-7'>

          <input {...register('email')} className='min-h-12 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none placeholder:text-[#92877e] focus:border-[#a33075]' type="email" name="email" placeholder='Email' />
          {errors.email && (<p className="-mt-5 text-red-500 text-sm">{errors.email.message}</p>)}


          <button className='min-h-12 bg-[#30251f] px-5 text-sm font-semibold text-white hover:bg-[#50372f]'>{isLoading ? (<div className='loader'></div> ) : 'Submit'}</button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
