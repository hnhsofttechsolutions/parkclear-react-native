import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/login/',
        method: 'POST',
        body: formData,
      }),
    }),
    signup: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/register/',
        method: 'POST',
        body: formData,
      }),
    }),
    otp: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/register_verify_otp/',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useSignupMutation, useOtpMutation } = authApi;
