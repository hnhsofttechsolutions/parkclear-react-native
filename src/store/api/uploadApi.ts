import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation<any, any>({
      query: ({ formData, url }: any) => ({
        url,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useUploadImageMutation } = uploadApi;


