import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { MdAddToPhotos } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCreateCategoryMutation, useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDebounce from '@/hooks/useDebounce';
import { useCreateRegionMutation, useDeleteRegionMutation, useGetRegionsQuery } from '@/app/features/api/regionsApiSlice';

const regionSchema = z.object({
  regionName: z.string().trim().min(1,"Please input a category name")
})


const Regions = () => {
   const [openModal,setOpenModal] = useState(false)
   const [searchTerm,setSearchTerm] = useState('')
   const [createRegion, {isLoading}] = useCreateRegionMutation()
   const value = useDebounce(searchTerm)
   const {data: regions} = useGetRegionsQuery({searchTerm: value});

  const {register,handleSubmit, reset, formState:{errors,isSubmitting}} = useForm({
    resolver: zodResolver(regionSchema)
  })

  const onSubmit = async (formData) => {
    try {
      const reg = await createRegion({...formData})
      reset()
    } catch (error) {
      console.log(error)
    }
  }

  const [deleteRegion, { isLoading: isDeleting }] = useDeleteRegionMutation();

  const handleDeleteRegion = async (regionId) => {
    try {
      await deleteRegion(regionId).unwrap();
    } catch (error) {
      console.error("Error deleting region:", error);
    }
  }


  return (
    <div className='w-full h-full pt-14'>
      <div className='flex items-center justify-between'>
            <div className='flex items-center gap-5'>
                <h1>Brands</h1>
                <input onChange={(e) => setSearchTerm(e.target.value)} placeholder='search product...'  className='appearance-none w-[320px] h-[37px] rounded-xl placeholer:text-xs text-[#121212]/70 border-[1px] border-black/40 px-5' />
            </div>

            <Button onClick={() => setOpenModal(true)} className='w-max h-[40px] px-6 flex items-center gap-3'>
                <MdAddToPhotos />
                Add Brand
            </Button>
        </div>  

         <div className='w-full lg:w-full overflow-x-scroll mt-10'>
              <Table className='lg:w-full w-[600px]'>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="text-left">Id</TableHead>
                          <TableHead className='text-left'>Name</TableHead>
                      </TableRow>
                  </TableHeader>
                {regions ? (
                        <TableBody>
                        {regions?.map(region => (
                            <TableRow key={region.id} className='rounded-lg shadow-lg bg-white'>
                                <TableCell className="grow w-[250px]"> {region.id} </TableCell>
                                <TableCell className="grow w-[250px]"> {region.regionName} </TableCell>
                                <TableCell className="grow w-[250px] flex items-center gap-3">  <GoTrash onClick={() => handleDeleteRegion(region.id)}  className='text-primary w-5 h-5' />  {isDeleting && <div className='loader-primary h-5 w-5'></div>} </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                    ) : (
                        <div>
                            No Region Found
                        </div>
                    )
                } 
                  
              </Table>
           </div>

        {openModal &&  
        <Modal 
        formSize={"sm"}
        handleModal={setOpenModal} 
        children={
        <form onSubmit={handleSubmit(onSubmit)} className='w-full overflow-y-scroll'>
             <div className='flex flex-col gap-1 w-full my-3'>
                <label>Brand Name</label>
                <input {...register('regionName')} type='text' className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                {errors.regionName && (<p className="mt-1 text-red-500 text-sm">{errors.regionName.message}</p>)}
             </div>
          <Button type='submit' className='w-full h-[50px]'>
            {isLoading ? 'Creating' : "Create Brand"}
          </Button>
        </form>
        }
        />}
    </div>
  )
}

export default Regions