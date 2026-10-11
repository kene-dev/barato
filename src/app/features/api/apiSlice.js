import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Products', 'Categories', 'Regions', 'Orders', 'Shipping', 'Wishlist', 'SalesBanner'],
  endpoints: () => ({}),
});
