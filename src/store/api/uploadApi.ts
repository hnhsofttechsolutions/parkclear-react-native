import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/parking-sign-analysis/',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      }),
    }),
    getUploadImage: builder.query<any, void>({
      query: () => `authentication/v1/parking-sign-analysis/park_gallery_view/`,
    }),
  }),
  overrideExisting: true,
});

export const { useUploadImageMutation, useGetUploadImageQuery } = uploadApi;
