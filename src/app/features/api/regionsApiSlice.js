import supabase from "@/app/supabaseClient";
import { apiSlice } from "./apiSlice";


const regionsApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        getRegions: builder.query({
            async queryFn({searchTerm}){
                let query = supabase
                .from('regions')
                .select('*')

                if(searchTerm){
                    query = query.textSearch('regionName', `${searchTerm}`)
                }

                const {data,error} = await query
                return error ? { error } : { data }
            },
            providesTags:['Regions']
        }),

        createRegion: builder.mutation({
            async queryFn(formData){
                const query = supabase
                .from('regions')
                .insert([formData])
                .single()

                const {data, error} = await query
                return error ? {error} : {data}
            },
            invalidatesTags:['Regions']
        }),

        deleteRegion: builder.mutation({
            async queryFn(regionId){
                const {data, error} = await supabase    
                .from('regions')
                .delete()
                .eq('id', regionId)
                .single()
                return error ? {error} : {data}
            },
            invalidatesTags:['Regions']
        })
    })
})


export const {useGetRegionsQuery, useCreateRegionMutation, useDeleteRegionMutation} = regionsApiSlice