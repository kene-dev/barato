import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { MdAddToPhotos } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDebounce from '@/hooks/useDebounce';
import { MdModeEditOutline } from "react-icons/md";
import { GoTrash } from "react-icons/go";

const categorySchema = z.object({
  categoryName: z.string().trim().min(1,"Please input a category name")
})


const Categories = () => {
   const [openModal,setOpenModal] = useState(false)
   const [searchTerm,setSearchTerm] = useState('')
   const [createCategory, {isLoading}] = useCreateCategoryMutation()
   const {data: categories} = useGetCategoriesQuery(useDebounce({searchTerm}));

  const {register,handleSubmit, reset, formState:{errors,isSubmitting}} = useForm({
    resolver: zodResolver(categorySchema)
  })

  const onSubmit = async (formData) => {
    try {
      const cat = await createCategory({...formData}).unwrap()
      console.log(cat)
      reset()
    } catch (error) {
      console.log(error)
    }
  }

  const [deleteCategory, {isLoading: deleteLoading}] = useDeleteCategoryMutation()

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId).unwrap()
      console.log(categoryId)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full h-full pt-14'>
      <div className='flex items-center justify-between'>
            <div className='flex items-center gap-5'>
                <h1>Categories List</h1>
                <input onChange={(e) => setSearchTerm(e.target.value)} placeholder='search product...'  className='appearance-none w-[320px] h-[37px] rounded-xl placeholer:text-xs text-[#121212]/70 border-[1px] border-black/40 px-5' />
            </div>

            <Button onClick={() => setOpenModal(true)} className='w-max h-[40px] px-6 flex items-center gap-3'>
                <MdAddToPhotos />
                Add Category
            </Button>
        </div>  

         <div className='w-full lg:w-full overflow-x-scroll mt-10'>
              <Table className='lg:w-full w-[600px]'>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="text-left">Id</TableHead>
                          <TableHead className='text-left'>Name</TableHead>
                          <TableHead className="text-left text-white"> Action </TableHead>
                      </TableRow>
                  </TableHeader>
  
                  <TableBody>
                          {categories?.map(category => (
                              <TableRow key={category.id} className='rounded-lg shadow-lg bg-white'>
                                  <TableCell className="grow w-[250px]"> {category.id} </TableCell>
                                  <TableCell className="grow w-[250px]"> {category.categoryName} </TableCell>
                                  <TableCell className="grow w-[250px] flex items-center gap-3">
                                    <GoTrash onClick={() => handleDelete(category.id)} className='text-primary w-5 h-5' /> 
                                      {deleteLoading &&  <div className='loader-primary h-5 w-5'></div>}            
                                    {/* <MdModeEditOutline className='text-primary w-5 h-5' /> */}
                                  </TableCell>
                              </TableRow>
                          ))}
                  </TableBody>
              </Table>
           </div>

        {openModal &&  
        <Modal 
        formSize={"sm"}
        handleModal={setOpenModal} 
        children={
        <form onSubmit={handleSubmit(onSubmit)} className='w-full overflow-y-scroll'>
             <div className='flex flex-col gap-1 w-full my-3'>
                <label>Category Name</label>
                <input {...register('categoryName')} type='text' className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                {errors.categoryName && (<p className="mt-1 text-red-500 text-sm">{errors.categoryName.message}</p>)}
             </div>
          <Button type='submit' className='w-full h-[50px]'>
            {isLoading ? 'Creating' : "Create Category"}
          </Button>
        </form>
        }
        />}
    </div>
  )
}

export default Categories