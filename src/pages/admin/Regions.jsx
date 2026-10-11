import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react'
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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDebounce from '@/hooks/useDebounce';
import { useCreateRegionMutation, useDeleteRegionMutation, useGetRegionsQuery } from '@/app/features/api/regionsApiSlice';

const regionSchema = z.object({
  regionName: z.string().trim().min(1,"Please enter a brand name")
})


const Regions = () => {
   const [openModal,setOpenModal] = useState(false)
   const [searchTerm,setSearchTerm] = useState('')
   const [createRegion, {isLoading}] = useCreateRegionMutation()
   const value = useDebounce(searchTerm)
   const {data: regions} = useGetRegionsQuery({searchTerm: value});

  const {register,handleSubmit, reset, formState:{errors}} = useForm({
    resolver: zodResolver(regionSchema)
  })

  const onSubmit = async (formData) => {
    try {
      await createRegion({...formData})
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
    <div className='w-full min-w-0'>
      <div className='mb-8 flex flex-col gap-5 border-b border-[#dfd2c5] pb-7 sm:flex-row sm:items-end sm:justify-between'>
            <div>
                <p className='mb-2 text-[11px] font-semibold tracking-[.2em] text-[#a33075] uppercase'>Inventory / Brands</p>
                <h1 className="text-4xl tracking-[-.05em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Brands</h1>
                <p className='mt-2 text-sm text-[#776b60]'>Keep your brand list easy to browse.</p>
                <input onChange={(e) => setSearchTerm(e.target.value)} aria-label='Search brands' placeholder='Search brands' className='mt-5 min-h-11 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075] sm:w-72' />
            </div>

            <Button onClick={() => setOpenModal(true)} className='min-h-11 w-full gap-2 rounded-none bg-[#30251f] px-5 text-white shadow-[3px_3px_0_#f83dbe] hover:bg-[#50372f] sm:w-auto'>
                <MdAddToPhotos />
                Add Brand
            </Button>
        </div>  

         <div className='w-full overflow-x-auto border border-[#e4d8cc] bg-white'>
              <Table className='min-w-[600px]'>
                  <TableHeader>
                      <TableRow className='bg-[#30251f] hover:bg-[#30251f]'>
                          <TableHead className="text-left text-white">Id</TableHead>
                          <TableHead className='text-left text-white'>Name</TableHead>
                          <TableHead className='text-left text-white'>Action</TableHead>
                      </TableRow>
                  </TableHeader>
                {regions ? (
                        <TableBody>
                        {regions?.map(region => (
                            <TableRow key={region.id} className='border-b border-[#eee5dc] bg-white hover:bg-[#faf7f2]'>
                                <TableCell className="grow w-[250px]"> {region.id} </TableCell>
                                <TableCell className="grow w-[250px]"> {region.regionName} </TableCell>
                                <TableCell className="grow w-[250px]"><div className='flex items-center gap-3'><button type='button' aria-label={`Delete ${region.regionName}`} disabled={isDeleting} onClick={() => handleDeleteRegion(region.id)} className='grid size-9 place-items-center border border-[#eaded4] text-[#a33075] hover:bg-[#f9e9f2] disabled:opacity-50'><GoTrash size={17} /></button>{isDeleting && <div className='loader-primary h-5 w-5' />}</div></TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                    ) : (
                        <TableBody><TableRow><TableCell colSpan={3} className='py-10 text-center text-[#776b60]'>No brands found</TableCell></TableRow></TableBody>
                    )
                } 
                  
              </Table>
           </div>

        {openModal && <Modal formSize="sm" handleModal={setOpenModal}>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-5'>
             <h2 className="pr-8 text-3xl tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">Add a brand</h2>
             <div className='flex flex-col gap-1 w-full my-3'>
                <label htmlFor='brand-name' className='text-xs font-semibold'>Brand name</label>
                <input {...register('regionName')} id='brand-name' type='text' className='min-h-12 w-full border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'/>
                {errors.regionName && (<p className="mt-1 text-red-500 text-sm">{errors.regionName.message}</p>)}
             </div>
          <Button type='submit' disabled={isLoading} className='w-full h-[50px] rounded-none bg-[#30251f] hover:bg-[#50372f]'>
            {isLoading ? 'Creating' : "Create Brand"}
          </Button>
        </form>
        </Modal>}
    </div>
  )
}

export default Regions
