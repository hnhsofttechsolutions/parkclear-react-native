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
      invalidatesTags: ['UPLOAD_IMAGE'],
    }),
    uploadCustomImage: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/analyze-parking-sign/',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      }),
      invalidatesTags: ['UPLOAD_IMAGE'],
    }),
    getUploadImage: builder.query<any, void>({
      query: () => `authentication/v1/parking-sign-analysis/park_gallery_view/`,
      providesTags: ['UPLOAD_IMAGE'],
    }),
    resultRemind: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/set_parking_reminder/',
        method: 'POST',
        body: formData,
      }),
    }),
    cancelRemind: builder.mutation<any, any>({
      query: ({}: any) => ({
        url: 'authentication/v1/user/cancel_parking_reminder/',
        method: 'POST',
      }),
    }),
    resultFeedback: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/parking-sign-analysis/parking_history_feedback/',
        method: 'PATCH',
        body: formData,
      }),
    }),
    screenStatus: builder.mutation<any, any>({
      query: ({}: any) => ({
        url: 'authentication/v1/user/update_screen_status/',
        method: 'POST',
      }),
    }),
    betaCanIParkHere: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/parking-sign-analysis/geo_parking_analysis/',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useUploadImageMutation,
  useUploadCustomImageMutation,
  useGetUploadImageQuery,
  useCancelRemindMutation,
  useScreenStatusMutation,
  useResultRemindMutation,
  useResultFeedbackMutation,
  useBetaCanIParkHereMutation,
} = uploadApi;
