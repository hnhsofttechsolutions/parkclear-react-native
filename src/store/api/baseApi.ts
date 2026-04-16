import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const baseURL = "https://laree-appraisive-randa.ngrok-free.dev/"
// export const baseURL = "http://167.114.96.66:2009/"
// export const baseURL = 'https://jlsxgq9c-8000.inc1.devtunnels.ms/';
export const baseURL = 'http://167.114.96.66:3209/';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: [''],
  endpoints: () => ({}),
});
