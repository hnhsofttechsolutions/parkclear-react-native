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
      invalidatesTags: ['ACTIVE_ALERTS'],
      query: ({ formData }: any) => ({
        url: 'authentication/v1/user/set_parking_reminder/',
        method: 'POST',
        body: formData,
      }),
    }),
    cancelRemind: builder.mutation<any, any>({
      invalidatesTags: ['ACTIVE_ALERTS'],
      query: (formData: any) => ({
        url: 'authentication/v1/user/cancel_parking_reminder/',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteParkingReminder: builder.mutation<any, { alert_id: number | string }>(
      {
        invalidatesTags: ['ACTIVE_ALERTS'],
        query: ({ alert_id }) => ({
          url: 'authentication/v1/user/delete_parking_reminder/',
          method: 'POST',
          body: { alert_id },
        }),
      },
    ),
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
    getNearbyZones: builder.mutation<
      any,
      { lat: string; lng: string; radius?: string; timezone: string }
    >({
      query: ({ lat, lng, radius = 1000, timezone }) => ({
        url: 'authentication/v1/parking/nearby-zones/',
        method: 'POST',
        body: { lat, lng, radius, timezone },
      }),
    }),
    getZoneSchedule: builder.mutation<any, { policy_ids: string[] }>({
      query: ({ policy_ids }) => ({
        url: 'authentication/v1/parking/zone-schedule/',
        method: 'POST',
        body: { policy_ids },
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
  useDeleteParkingReminderMutation,
  useScreenStatusMutation,
  useResultRemindMutation,
  useResultFeedbackMutation,
  useBetaCanIParkHereMutation,
  useGetNearbyZonesMutation,
  useGetZoneScheduleMutation,
} = uploadApi;
