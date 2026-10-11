import supabase from "@/app/supabaseClient";
import { apiSlice } from "./apiSlice";
import { hasPreviousPrice } from '@/lib/productPricing';

// const baseUrl = 'https://byunydadjltixnqibsdm.supabase.co'
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const productApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        createProduct: builder.mutation({
            async queryFn(productData) {
              const { data, error } = await supabase
                .from('products')
                .insert([productData])
                .single()
      
              return error ? { error } : { data }
            },
            invalidatesTags: ['Products']
          }),


        getSingleProduct: builder.query({
            async queryFn(id) {
              const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()
              return error ? { error } : { data }
            }
          }),

          getSalesProducts: builder.query({
            async queryFn() {
              const batchSize = 500;
              const saleProducts = [];
              let start = 0;

              // Filter before the Sales page paginates, including products beyond the first API page.
              while (true) {
                const { data, error } = await supabase
                  .from('products')
                  .select('*')
                  .order('created_at', { ascending: false })
                  .range(start, start + batchSize - 1);

                if (error) return { error };
                saleProducts.push(...data.filter(product => hasPreviousPrice(product.productPrice, product.discountedPrice)));
                if (data.length < batchSize) break;
                start += batchSize;
              }

              return { data: saleProducts };
            },
            providesTags: ['Products']
          }),

          getProducts: builder.query({
            async queryFn({searchTerm, category, priceRange, region, page, pageSize}) {
              
              let query = supabase
                .from('products')
                .select('*,regions(regionName),categories(categoryName)', { count: 'exact' })
                .order('created_at', { ascending: false })

                  if(searchTerm){
                    // Search across multiple fields using OR with ilike
                    // This searches in productName and productDescription fields
                    // Escape special characters in search term for SQL LIKE
                    const escapedTerm = searchTerm.replace(/%/g, '\\%').replace(/_/g, '\\_')
                    const searchPattern = `%${escapedTerm}%`
                    // Use or() with comma-separated conditions (Supabase format)
                    query = query.or(`productName.ilike.${searchPattern},productDescription.ilike.${searchPattern}`)
                  }
                  
                  if(category){
                    query = query.eq('productCategory', category)
                  }

                  if(region){
                    query = query.eq('productRegion', region)
                  }
                  
                  if(priceRange){
                   query = query.gte('productPrice', priceRange[0]).lte('productPrice', priceRange[1])
                  }

                  // 3. Apply pagination AFTER filters
                  const startIndex = (page - 1) * pageSize;
                  const endIndex = startIndex + pageSize - 1;
                  query = query.range(startIndex, endIndex);

                  const { data, error, count } = await query
            
                  return error ? { error } : { data: { products: data, totalCount: count }} 
              
            },
            providesTags: ['Products']
          }),

          getProductsByCategory:builder.query({
            async queryFn(category){
                const {data, error} = await supabase.from('products').select("*").eq('productCategory', category)
                return error ? {error} : {data}
            }
          }),

          getAdminProducts: builder.query({
            async queryFn({searchTerm, page, pageSize}) {
              let query = supabase
              .from('products')
              .select('*,regions(regionName),categories(categoryName)', {count: 'exact'})
              .order('created_at', { ascending: false })
            
              if(searchTerm){
                // Search across multiple fields using OR with ilike
                // Escape special characters in search term for SQL LIKE
                const escapedTerm = searchTerm.replace(/%/g, '\\%').replace(/_/g, '\\_')
                const searchPattern = `%${escapedTerm}%`
                // Use or() with comma-separated conditions (Supabase format)
                query = query.or(`productName.ilike.${searchPattern},productDescription.ilike.${searchPattern}`)
              }

              const startIndex = (page - 1) * pageSize;
              const endIndex = startIndex + pageSize - 1;
              query = query.range(startIndex, endIndex);
              
              const { data, error,count } = await query
              console.log(`ADMIN QUERY COUNT ${data}`)
              return error ? { error } : { data: { products: data, totalCount: count }} 
            },
            providesTags: ['Products']
          }),

          deleteProduct:builder.mutation({
            async queryFn(id){
                const {data, error} = await supabase.from('products').delete().eq('id', id).select('*')
                
                return error ? { error } : { data }
            },
            invalidatesTags: ['Products']
          }),

          updateProduct: builder.mutation({
            async queryFn({updateData, id}) {
                try { 

                const { data, error } = await supabase
                .from('products')
                .update(updateData)
                .eq('id', id)
                .select()
                    
                if (error) throw error
                return {data}
                } catch (error) {
                    console.log(error)
                    return { error };
                }
            },

        invalidatesTags:['Products']
        }),
          
    })
})

export const {useCreateProductMutation, useGetProductsQuery, useGetSalesProductsQuery, useGetAdminProductsQuery, useGetSingleProductQuery, useGetProductsByCategoryQuery, useDeleteProductMutation, useUpdateProductMutation} = productApiSlice
