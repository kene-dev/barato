import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
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
import { Search } from 'lucide-react';


const productSchema = z.object({
    productName: z.string().trim().min(1, "Please add a product name"),
    productDescription: z.string().trim().min(1,"Please add a product descripotion"),
    productPrice: z.coerce.number().min(1, "Please include a discounted price"),
    discountedPrice: z.coerce.number().optional(),
    productImage: z.any().refine(file => file?.length !== 0, 'Image is required'),
    productCategory: z.coerce.number().min(1, "Category selection is required"),
    productRegion: z.coerce.number().min(1, "Category selection is required")
})

// Edit schema: image optional for edits
const editProductSchema = z.object({
    productName: z.string().trim().min(1, "Please add a product name"),
    productDescription: z.string().trim().min(1,"Please add a product descripotion"),
    productPrice: z.coerce.number().min(1, "Please include a discounted price"),
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

    const {register, handleSubmit,reset, formState:{errors}} = useForm({
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
    <div className='w-full min-w-0'>
        <div className='mb-8 flex flex-col gap-5 border-b border-[#dfd2c5] pb-7 sm:flex-row sm:items-end sm:justify-between'>
            <div>
                <p className='mb-2 text-[11px] font-semibold tracking-[.2em] text-[#a33075] uppercase'>Inventory / Products</p>
                <h1 className="text-4xl leading-tight tracking-[-.05em] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">Product collection</h1>
                <p className='mt-2 text-sm text-[#776b60]'>Manage the details shoppers see in your store.</p>
            </div>

            <Button onClick={() => setOpenModal(true)} className='min-h-11 w-full gap-2 rounded-none bg-[#30251f] px-5 text-white shadow-[3px_3px_0_#f83dbe] hover:bg-[#50372f] sm:w-auto'>
                <MdAddToPhotos />
                Add Product
            </Button>
        </div>

            <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-sm text-[#776b60]'>{data?.totalCount ?? 0} products in your collection</p>
              <label className='relative block w-full sm:max-w-xs'>
                <span className='sr-only'>Search products</span>
                <Search size={17} className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#927f71]' />
                <input value={searchTerm} placeholder='Search products' onChange={(e) => setSearchTerm(e.target.value)} className='min-h-11 w-full border border-[#d8c9ba] bg-white pr-4 pl-10 text-sm outline-none placeholder:text-[#9b8d81] focus:border-[#a33075]' />
              </label>
            </div>
            {deleteLoading && <p role='status' className='mb-4 text-sm text-[#a33075]'>Deleting product…</p>}

                <div className='w-full overflow-x-auto border border-[#e4d8cc] bg-white'>
                    <Table className='min-w-[950px]'>
                        <TableHeader>
                            <TableRow className='border-none bg-[#30251f] hover:bg-[#30251f]'>
                                <TableHead className="w-52 text-left text-white">Name</TableHead>
                                <TableHead className='text-left text-white'>Image</TableHead>
                                <TableHead className='text-center text-white'>Discounted price</TableHead>
                                <TableHead className='text-left text-white'>Description</TableHead>
                                <TableHead className='text-left text-white'>Category</TableHead>
                                <TableHead className='text-left text-white'>Region</TableHead>
                                <TableHead className="text-left text-white"> Action </TableHead>
                            </TableRow>
                        </TableHeader>
        
                        <TableBody>
                                {data?.products?.map(product => (
                                    <TableRow key={product.id} className='border-b border-[#eee5dc] bg-white hover:bg-[#faf7f2]'>
                                        <TableCell className="w-52 max-w-52 whitespace-normal font-medium text-[#30251f]">
                                            <span className='block [overflow-wrap:anywhere]'>{product.productName}</span>
                                        </TableCell>
                                        <TableCell className=""> 
                                            <div className="relative size-14 overflow-hidden bg-[#f5f0eb]">
                                                <img 
                                                className="w-full h-full object-contain" 
                                                src={product.productImage} 
                                                alt={product.productName} 
                                                />
                                            </div>
                                        </TableCell>

                                        {/* <TableCell className="basis-5xl"> <img className='w-[300px] basis-5xl lg:h-[47px] h-[300.31px] object-cover' src={product.productImage} /> 
                                        </TableCell> */}
                                        <TableCell className='text-center font-semibold whitespace-nowrap'>₦{Number(product.productPrice).toLocaleString('en-NG')}</TableCell>
                                        <TableCell><p className='max-w-56 truncate text-sm text-[#776b60]' title={product.productDescription}>{product.productDescription}</p></TableCell>
                                        <TableCell className='text-sm'>{product.categories?.categoryName}</TableCell>
                                        <TableCell className='text-sm'>{product.regions?.regionName}</TableCell>
                                        <TableCell>
                                          <div className='flex items-center gap-2'>
                                            <button type='button' disabled={deleteLoading} aria-label={`Delete ${product.productName}`} onClick={() => dispatch(deleteProduct(product.id))} className='grid size-9 place-items-center border border-[#eaded4] text-[#a33075] hover:bg-[#f9e9f2] focus-visible:outline-2 focus-visible:outline-[#a33075] disabled:opacity-50'><GoTrash size={17} /></button>
                                                
                                            <button type='button' aria-label={`Edit ${product.productName}`} onClick={() => {
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
                                            }} className='grid size-9 place-items-center border border-[#eaded4] text-[#30251f] hover:bg-[#eee7df] focus-visible:outline-2 focus-visible:outline-[#a33075]'><MdModeEditOutline size={17} /></button>
                                          </div>
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

                {openModal && <Modal formSize="lg" handleModal={setOpenModal}>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-5 [&_label]:text-xs [&_label]:font-semibold [&_label]:tracking-wide [&_label]:text-[#5e5148]'>
                    <div className='mb-6 pr-10'>
                      <p className='mb-2 text-[11px] font-semibold tracking-[.18em] text-[#a33075] uppercase'>New listing</p>
                      <h2 className="text-3xl tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">Add a product</h2>
                    </div>
                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='create-brand'>Brand</label>
                            <select {...register('productRegion')} id='create-brand' className='appearance-none w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'>
                                <option disabled selected >Select product Brand</option>
                                {regions?.map(region => (
                                    <option key={region.id} value={region.id}>{region.regionName}</option>
                                ))}
                            </select>
                            {errors.productRegion && (<p className="mt-1 text-red-500 text-sm">{errors.productRegion.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='create-category'>Category</label>
                            <select {...register('productCategory')} id='create-category' className='appearance-none w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'>
                                <option disabled selected >Select product category</option>
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                                ))}
                            </select>
                            {errors.productCategory && (<p className="mt-1 text-red-500 text-sm">{errors.productCategory.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full sm:col-span-2'>
                            <label htmlFor='create-name'>Product name</label>
                            <input {...register('productName')} id='create-name' type='text' className='appearance-none w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'/>
                            {errors.productName && (<p className="mt-1 text-red-500 text-sm">{errors.productName.message}</p>)}
                        </div>
                    </div>

                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='create-price'>Product price</label>
                            <input {...register('productPrice')} id='create-price' type='number' className='w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
                            {errors.productPrice && (<p className="mt-1 text-red-500 text-sm">{errors.productPrice.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='create-original' className='text-sm lg:text-base'>Discounted Price (optional)</label>
                            <input {...register('discountedPrice')} id='create-original' type='text' className='w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label htmlFor='create-description'>Description</label>
                        <textarea {...register('productDescription')} id='create-description' className='w-full min-h-32 border border-[#d8c9ba] bg-white p-4 text-sm outline-none focus:border-[#a33075]'/>
                        {errors.productDescription && (<p className="mt-1 text-red-500 text-sm">{errors.productDescription.message}</p>)}
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor='create-image' className='flex items-center gap-3 cursor-pointer'>
                            Product image
                            <BiCloudUpload className='text-primary w-8 h-8' />
                        </label>
                        <input {...register('productImage')} id='create-image' type='file' accept='image/*' className='w-full cursor-pointer text-sm'/>
                        {errors.productImage && (<p className="mt-1 text-red-500 text-sm">{errors.productImage.message}</p>)}
                    </div>

                    <Button type='submit' disabled={isLoading} className='w-full h-[50px] rounded-none bg-[#30251f] hover:bg-[#50372f]'>
                        {isLoading ? 'Creating' : "Create Product"}
                     
                    </Button>
                </form>
                </Modal>}


                {openEditModal && <Modal formSize="lg" handleModal={setOpenEditModal}>
                <form onSubmit={handleSubmitEdit(onSubmitEdit)} className='w-full space-y-5 [&_label]:text-xs [&_label]:font-semibold [&_label]:tracking-wide [&_label]:text-[#5e5148]'>
                    <div className='mb-6 pr-10'>
                      <p className='mb-2 text-[11px] font-semibold tracking-[.18em] text-[#a33075] uppercase'>Edit listing</p>
                      <h2 className="text-3xl tracking-[-.04em] [font-family:Georgia,'Times_New_Roman',serif]">Update product</h2>
                    </div>
                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='edit-brand'>Brand</label>
                            <select {...registerEdit('productRegion')} id='edit-brand' className='appearance-none w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'>
                                <option disabled selected >Select product brand</option>
                                {regions?.map(region => (
                                    <option key={region.id} value={region.id}>{region.regionName}</option>
                                ))}
                            </select>
                            {editErrors.productRegion && (<p className="mt-1 text-red-500 text-sm">{editErrors.productRegion.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='edit-category'>Category</label>
                            <select {...registerEdit('productCategory')} id='edit-category' className='appearance-none w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'>
                                <option disabled selected >Select product category</option>
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                                ))}
                            </select>
                            {editErrors.productCategory && (<p className="mt-1 text-red-500 text-sm">{editErrors.productCategory.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full sm:col-span-2'>
                            <label htmlFor='edit-name'>Product name</label>
                            <input {...registerEdit('productName')} id='edit-name' type='text' className='appearance-none w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075]'/>
                            {editErrors.productName && (<p className="mt-1 text-red-500 text-sm">{editErrors.productName.message}</p>)}
                        </div>
                    </div>

                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='edit-price'>Product Price</label>
                            <input {...registerEdit('productPrice')} id='edit-price' type='number' className='w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
                            {editErrors.productPrice && (<p className="mt-1 text-red-500 text-sm">{editErrors.productPrice.message}</p>)}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor='edit-original' className='text-sm lg:text-base'>Discounted Price (optional)</label>
                            <input {...registerEdit('discountedPrice')} id='edit-original' type='text' className='w-full min-h-12 border border-[#d8c9ba] bg-white px-4 text-sm outline-none focus:border-[#a33075] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
                            {editErrors.discountedPrice && (<p className="mt-1 text-red-500 text-sm">{editErrors.discountedPrice.message}</p>)}
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label htmlFor='edit-description'>Description</label>
                        <textarea {...registerEdit('productDescription')} id='edit-description' className='w-full min-h-32 border border-[#d8c9ba] bg-white p-4 text-sm outline-none focus:border-[#a33075]'/>
                        {editErrors.productDescription && (<p className="mt-1 text-red-500 text-sm">{editErrors.productDescription.message}</p>)}
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor='edit-image' className='flex items-center gap-3 cursor-pointer'>
                            Replace product image (optional)
                            <BiCloudUpload className='text-primary w-8 h-8' />
                        </label>
                        <input {...registerEdit('productImage')} id='edit-image' type='file' accept='image/*' className='w-full cursor-pointer text-sm'/>
                        {/* Image optional on edit */}
                    </div>

                    <Button type='submit' disabled={isUpdating} className='w-full h-[50px] rounded-none bg-[#30251f] hover:bg-[#50372f]'>
                        {isUpdating ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
                </Modal>}
                
    </div>
  )
}

export default Products
