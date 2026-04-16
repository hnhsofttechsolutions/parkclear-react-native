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
    forgotPassword: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/send_reset_email/',
        method: 'POST',
        body: formData,
      }),
    }),
    otpForgot: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/verify_otp/',
        method: 'POST',
        body: formData,
      }),
    }),
    createNewPassword: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/reset_password/',
        method: 'POST',
        body: formData,
      }),
    }),
    otpRegister: builder.mutation<any, any>({
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/register_verify_otp/',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useOtpRegisterMutation,
  useOtpForgotMutation,
  useCreateNewPasswordMutation,
  useForgotPasswordMutation,
} = authApi;
