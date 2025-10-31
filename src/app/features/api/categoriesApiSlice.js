import { apiSlice } from "./apiSlice";
import supabase from "@/app/supabaseClient";



const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            async queryFn({searchTerm}){
                if(searchTerm){
                    const query = supabase
                    .from('categories')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .textSearch('categoryName', `${searchTerm}`)

                    const { data, error } = await query
                    return error ? { error } : { data }
                }else {
                    const query = supabase
                    .from('categories')
                    .select('*')
                    .order('created_at', { ascending: false })

                    const { data, error } = await query
                    return error ? { error } : { data }
                }
            },
            providesTags: ['Categories']
        }),

        createCategory: builder.mutation({
            async queryFn(categoryData){
                const { data, error } = await supabase
                .from('categories')
                .insert([categoryData])
                .single()
              
              return error ? { error } : { data }
            },
            invalidatesTags:['Categories']
        }),

        deleteCategory: builder.mutation({
            async queryFn(categoryId){
                const { data, error } = await supabase
                .from('categories')
                .delete()
                .eq('id', categoryId)
                .single()
              
            return error ? { error } : { data }
            },
            invalidatesTags:['Categories']
        })
    })
})

export const {useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation} = categoriesApiSlice;