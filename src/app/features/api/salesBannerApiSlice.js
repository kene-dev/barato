import supabase from '@/app/supabaseClient'
import { apiSlice } from './apiSlice'

const salesBannerApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSalesBanner: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from('salesBanner')
          .select('*')
          .limit(1)
          .maybeSingle()

        return error ? { error } : { data }
      },
      providesTags: ['SalesBanner'],
    }),
    
    saveSalesBanner: builder.mutation({
      async queryFn({ headline, description }) {
        const { data: existing, error: readError } = await supabase
          .from('salesBanner')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (readError) return { error: readError }

        const values = { headline, description }
        let query

        if (existing) {
          query = supabase.from('salesBanner').update(values)
          if (existing.id !== undefined && existing.id !== null) {
            query = query.eq('id', existing.id)
          } else {
            // Tables containing only the two requested text columns can still update their existing row.
            query = query.eq('headline', existing.headline).eq('description', existing.description)
          }
        } else {
          query = supabase.from('salesBanner').insert([values])
        }

        const { data, error } = await query.select('*').single()
        return error ? { error } : { data }
      },
      invalidatesTags: ['SalesBanner'],
    }),
  }),
})

export const { useGetSalesBannerQuery, useSaveSalesBannerMutation } = salesBannerApiSlice
