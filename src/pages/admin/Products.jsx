import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
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
import { BiCloudUpload } from "react-icons/bi";
import Modal from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from '@/app/supabaseClient';
import { useCreateProductMutation, useDeleteProductMutation, useGetAdminProductsQuery, useUpdateProductMutation } from '@/app/features/api/productApiSlice';
import { useGetCategoriesQuery } from '@/app/features/api/categoriesApiSlice';
import useDebounce from '@/hooks/useDebounce';
import { useGetRegionsQuery } from '@/app/features/api/regionsApiSlice';
import ReactPaginate from 'react-paginate';
import { useDispatch } from 'react-redux';
import { MdModeEditOutline } from "react-icons/md";


const productSchema = z.object({
    productName: z.string().trim().min(1, "Please add a product name"),
    productDescription: z.string().trim().min(1,"Please add a product descripotion"),
    productPrice: z.coerce.number().min(1, "Please include product price"),
    discountedPrice: z.coerce.number().optional(),
    productImage: z.any().refine(file => file?.length !== 0, 'Image is required'),
    productCategory: z.coerce.number().min(1, "Category selection is required"),
    productRegion: z.coerce.number().min(1, "Category selection is required")
})

// Edit schema: image optional for edits
const editProductSchema = z.object({
    productName: z.string().trim().min(1, "Please add a product name"),
    productDescription: z.string().trim().min(1,"Please add a product descripotion"),
    productPrice: z.coerce.number().min(1, "Please include product price"),
    discountedPrice: z.preprocess((val) => {
        if (val === '' || val === null) return undefined
        return val
    }, z.coerce.number().optional()),
    productImage: z.any().optional(),
    productCategory: z.coerce.number().min(1, "Category selection is required"),
    productRegion: z.coerce.number().min(1, "Category selection is required")
})



const Products = () => {
    const [openModal,setOpenModal] = useState(false)
    const [openEditModal,setOpenEditModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [page, setPage] = useState(1)
    const [searchTerm,setSearchTerm] = useState('')
    const [createProduct, {isLoading}] = useCreateProductMutation()
    const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation()
    const value = useDebounce(searchTerm)
    const {data} = useGetAdminProductsQuery({searchTerm: value, page, pageSize: 7});
    const {data: categories} = useGetCategoriesQuery({searchTerm: ''});
    const {data: regions} = useGetRegionsQuery({searchTerm: ''});
    const [deleteProduct,{isLoading:deleteLoading}] = useDeleteProductMutation()
    const dispatch = useDispatch()

    const {register, handleSubmit,reset, formState:{errors,isSubmitting}} = useForm({
        resolver: zodResolver(productSchema)
    })

    // Separate form for Edit modal
    const {register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState:{errors: editErrors, dirtyFields: editDirtyFields}} = useForm({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            productName: selectedProduct?.productName ?? '',
            productDescription: selectedProduct?.productDescription ?? '',
            productPrice: selectedProduct?.productPrice ?? '',
            discountedPrice: selectedProduct?.discountedPrice ?? '',
            productCategory: selectedProduct?.productCategory ?? '',
            productRegion: selectedProduct?.productRegion ?? '',
            productImage: undefined
        }
    })


    const handleImageUpload = async (file) => {
        try {
            const fileName = `${Date.now()}-${file.name}`
            const { data, error } = await supabase.storage
            .from('product-image')
            .upload(fileName, file)
        
            if (error) throw error;

            // Get public URL
            const { data: url } = supabase.storage
              .from('product-image')
              .getPublicUrl(data.path);
            
              console.log(url)
            return url.publicUrl;
        } catch (error) {
            console.log(error)
        }
      }

    const onSubmit = async (formData) => {
        try {
          const imageUrl = await handleImageUpload(formData.productImage[0])
          
          await createProduct({
            ...formData,
            productPrice: Number(formData.productPrice),
            discountedPrice: Number(formData.discountedPrice),
            productImage: imageUrl
          })
          
          reset()
          setOpenModal(false)
        } catch (error) {
          console.error('Error creating product:', error)
        }
    }

    const onSubmitEdit = async (formData) => {
        try {
            const hasDirtyFields = editDirtyFields && Object.keys(editDirtyFields).length > 0;
            if (!hasDirtyFields) {
                setOpenEditModal(false);
                return;
            }

            // Start with only dirty fields
            const updateData = Object.keys(editDirtyFields).reduce((acc, field) => {
                if (editDirtyFields[field]) {
                    acc[field] = formData[field];
                }
                return acc;
            }, {});

            // Handle image upload if changed and provided
            if (editDirtyFields.productImage && formData.productImage && formData.productImage.length > 0) {
                const uploadedUrl = await handleImageUpload(formData.productImage[0])
                updateData.productImage = uploadedUrl
            } else {
                // Do not modify image if not provided
                delete updateData.productImage
            }

            // Coerce numeric fields if present
            if (updateData.productPrice !== undefined && updateData.productPrice !== '') {
                updateData.productPrice = Number(updateData.productPrice)
            }
            if (updateData.productCategory !== undefined && updateData.productCategory !== '') {
                updateData.productCategory = Number(updateData.productCategory)
            }
            if (updateData.productRegion !== undefined && updateData.productRegion !== '') {
                updateData.productRegion = Number(updateData.productRegion)
            }
            if (updateData.discountedPrice !== undefined) {
                if (updateData.discountedPrice === '' || updateData.discountedPrice === null) {
                    delete updateData.discountedPrice
                } else {
                    updateData.discountedPrice = Number(updateData.discountedPrice)
                }
            }

            if (Object.keys(updateData).length === 0) {
                setOpenEditModal(false)
                return
            }
            

            await updateProduct({ id: selectedProduct.id, updateData })

            resetEdit()
            setSelectedProduct(null)
            setOpenEditModal(false)
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }


  const handlePageClick = ({ selected }) => {
    setPage(selected + 1 );
  };

    useEffect(() => {
        if(value){
            setPage(1)
        }
    },[value])

  return (
    <div className='w-full h-screen overflow-y-scroll pt-14 px-5'>
        <div className='flex flex-col lg:flex-row items-center gap-3 lg:gap-0 justify-between'>
            <div className='flex items-center gap-5'>
                <h1 className='font-semibold'>Product List</h1>
                <input placeholder='search product...' onChange={(e) => setSearchTerm(e.target.value)}  className='appearance-none lg:w-[320px] h-[37px] rounded-xl placeholer:text-xs text-[#121212]/70 border-[1px] border-black/40 px-5' />
            </div>

            <Button onClick={() => setOpenModal(true)} className='lg:w-max w-full h-[40px] px-6 flex items-center gap-3'>
                <MdAddToPhotos />
                Add Product
            </Button>
        </div>  

            {deleteLoading && <p>DELETING PRODUCT ABEG</p>}

                <div className='w-full lg:w-full h-[70%] overflow-x-scroll mt-10'>
                    <Table className='lg:w-full h-full w-[600px] mb-5'>
                        <TableHeader>
                            <TableRow className='bg-primary hover:bg-primary'>
                                <TableHead className="text-left text-white">Name</TableHead>
                                <TableHead className='text-left text-white'>Image</TableHead>
                                <TableHead className='text-center text-white'>Price</TableHead>
                                <TableHead className='text-left text-white'>Description</TableHead>
                                <TableHead className='text-left text-white'>Category</TableHead>
                                <TableHead className='text-left text-white'>Region</TableHead>
                                <TableHead className="text-left text-white"> Action </TableHead>
                            </TableRow>
                        </TableHeader>
        
                        <TableBody>
                                {data?.products?.map(product => (
                                    <TableRow key={product.id} className='rounded-lg shadow-lg bg-white'>
                                        <TableCell className="grow w-[40px] lg:w-[250px]">{product.productName} </TableCell>
                                        <TableCell className=""> 
                                            <div className="relative lg:w-[70px] w-[80px] aspect-square overflow-hidden">
                                                <img 
                                                className="w-full h-full object-contain" 
                                                src={product.productImage} 
                                                alt={product.productName} 
                                                />
                                            </div>
                                        </TableCell>

                                        {/* <TableCell className="basis-5xl"> <img className='w-[300px] basis-5xl lg:h-[47px] h-[300.31px] object-cover' src={product.productImage} /> 
                                        </TableCell> */}
                                        <TableCell className='grow text-center'><p className='text-center  w-[150px] pr-4'> ₦{product.productPrice} </p></TableCell>
                                        <TableCell><p className='text-wrap  w-[300px] pr-4'>{product.productDescription}</p> </TableCell>
                                        <TableCell><p className='text-wrap  w-[200px] pr-4'>{product.categories?.categoryName}</p> </TableCell>
                                        <TableCell><p className='text-wrap  w-[200px] pr-4'>{product.regions?.regionName}</p> </TableCell>
                                        <TableCell className='grow w-[250px] h-full flex items-center justify-center gap-3'>
                                            <GoTrash onClick={() => dispatch(deleteProduct(product.id))}  className='text-primary w-5 h-5' />
                                                
                                            <MdModeEditOutline onClick={() => {
                                                setSelectedProduct(product)
                                                // Prefill edit form values
                                                resetEdit({
                                                    productName: product.productName,
                                                    productDescription: product.productDescription,
                                                    productPrice: product.productPrice,
                                                    discountedPrice: product.discountedPrice ?? '',
                                                    productCategory: product.productCategory,
                                                    productRegion: product.productRegion,
                                                    productImage: undefined
                                                })
                                                setOpenEditModal(true)
                                            }} className='text-primary w-5 h-5' />
                                            </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                </div>
                    <ReactPaginate
                        previousLabel="←"
                        nextLabel="→"
                        pageCount={Math.ceil(data?.totalCount / 7)}
                        onPageChange={handlePageClick}
                        containerClassName="pagination"
                        activeClassName="active"
                        forcePage={page - 1} // Convert to zero-based index
                        disableInitialCallback={true}
                    />

                {openModal &&  
                <Modal 
                formSize={"lg"}
                handleModal={setOpenModal} 
                children={
                <form onSubmit={handleSubmit(onSubmit)} className='w-full overflow-y-scroll'>
                    <div className='w-full flex flex-col gap-8'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label>Brands</label>
                            <select {...register('productRegion')} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'>
                                <option disabled selected >Select product Brand</option>
                                {regions?.map(region => (
                                    <option key={region.id} value={region.id}>{region.regionName}</option>
                                ))}
                            </select>
                            {errors.productRegion && (<p className="mt-1 text-red-500 text-sm">{errors.productRegion.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label>Category</label>
                            <select {...register('productCategory')} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'>
                                <option disabled selected >Select product category</option>
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                                ))}
                            </select>
                            {errors.productCategory && (<p className="mt-1 text-red-500 text-sm">{errors.productCategory.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full my-3'>
                            <label>Product Name</label>
                            <input {...register('productName')} type='text' className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                            {errors.productName && (<p className="mt-1 text-red-500 text-sm">{errors.productName.message}</p>)}
                        </div>
                    </div>

                    <div className='w-full flex items-start  gap-8 my-3'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label>Price</label>
                            <input {...register('productPrice')} type='number' className='w-full h-[50px] rounded-md border-[1px] border-black/40 px-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
                            {errors.productPrice && (<p className="mt-1 text-red-500 text-sm">{errors.productPrice.message}</p>)}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-sm lg:text-base'>Discount (optional)</label>
                            <input {...register('discountedPrice')} type='text' className='w-full h-[50px] rounded-md border-[1px] border-black/40 px-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 w-full my-3'>
                        <label>Description</label>
                        <textarea {...register('productDescription')} type='text' className='appearance-none w-full h-[150px] rounded-md border-[1px] border-black/40 p-5'/>
                        {errors.productDescription && (<p className="mt-1 text-red-500 text-sm">{errors.productDescription.message}</p>)}
                    </div>

                    <div className='flex flex-col gap-1 w-max my-3'>
                        <label htmlFor='image' className='flex items-center gap-3  rounded-md cursor-pointer'>
                            Upload Image
                            <BiCloudUpload className='text-primary w-8 h-8' />
                        </label>
                        <input {...register('productImage')}   id='image' type='file' className='appearance-none cursor-pointer'/>
                        {errors.productImage && (<p className="mt-1 text-red-500 text-sm">{errors.productImage.message}</p>)}
                    </div>

                    <Button type='submit' className='w-full h-[50px]'>
                        {isLoading ? 'Creating' : "Create Product"}
                     
                    </Button>
                </form>
                }
                />}


                {openEditModal &&  
                <Modal 
                formSize={"lg"}
                handleModal={setOpenEditModal} 
                children={
                <form onSubmit={handleSubmitEdit(onSubmitEdit)} className='w-full overflow-y-scroll'>
                    <div className='w-full flex flex-col gap-8'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label>Regions</label>
                            <select {...registerEdit('productRegion')} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'>
                                <option disabled selected >Select product category</option>
                                {regions?.map(region => (
                                    <option key={region.id} value={region.id}>{region.regionName}</option>
                                ))}
                            </select>
                            {editErrors.productRegion && (<p className="mt-1 text-red-500 text-sm">{editErrors.productRegion.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label>Category</label>
                            <select {...registerEdit('productCategory')} className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'>
                                <option disabled selected >Select product category</option>
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                                ))}
                            </select>
                            {editErrors.productCategory && (<p className="mt-1 text-red-500 text-sm">{editErrors.productCategory.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full my-3'>
                            <label>Product Name</label>
                            <input {...registerEdit('productName')} type='text' className='appearance-none w-full h-[50px] rounded-md border-[1px] border-black/40 px-5'/>
                            {editErrors.productName && (<p className="mt-1 text-red-500 text-sm">{editErrors.productName.message}</p>)}
                        </div>
                    </div>

                    <div className='w-full flex items-start  gap-8 my-3'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label>Price</label>
                            <input {...registerEdit('productPrice')} type='number' className='w-full h-[50px] rounded-md border-[1px] border-black/40 px-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
                            {editErrors.productPrice && (<p className="mt-1 text-red-500 text-sm">{editErrors.productPrice.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-sm lg:text-base'>Discount (optional)</label>
                            <input {...registerEdit('discountedPrice')} type='text' className='w-full h-[50px] rounded-md border-[1px] border-black/40 px-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
                            {editErrors.discountedPrice && (<p className="mt-1 text-red-500 text-sm">{editErrors.discountedPrice.message}</p>)}
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 w-full my-3'>
                        <label>Description</label>
                        <textarea {...registerEdit('productDescription')} type='text' className='appearance-none w-full h-[150px] rounded-md border-[1px] border-black/40 p-5'/>
                        {editErrors.productDescription && (<p className="mt-1 text-red-500 text-sm">{editErrors.productDescription.message}</p>)}
                    </div>

                    <div className='flex flex-col gap-1 w-max my-3'>
                        <label htmlFor='image' className='flex items-center gap-3  rounded-md cursor-pointer'>
                            Upload Image
                            <BiCloudUpload className='text-primary w-8 h-8' />
                        </label>
                        <input {...registerEdit('productImage')}   id='image' type='file' className='appearance-none cursor-pointer'/>
                        {/* Image optional on edit */}
                    </div>

                    <Button type='submit' className='w-full h-[50px]'>
                        {isUpdating ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
                }
                />}
                
    </div>
  )
}

export default Products