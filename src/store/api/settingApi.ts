import { baseApi } from './baseApi';

export const settingApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    deleteAccount: builder.mutation<any, any>({
      query: () => ({
        url: 'authentication/v1/user/deactivate_account/',
        method: 'POST',
      }),
    }),
    contact: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'user/v1/contact-message/contact_us/',
        method: 'POST',
        body: formData,
      }),
    }),
    feedback: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'user/v1/contact-message/feedback/',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useDeleteAccountMutation,
  useContactMutation,
  useFeedbackMutation,
} = settingApi;
