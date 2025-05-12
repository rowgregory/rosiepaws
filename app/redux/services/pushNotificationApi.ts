import { api } from './api'

const BASE_URL = '/push-notification'

export const pushNotificationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    sendPushNotification: build.mutation({
      query: (body: any) => ({ url: `${BASE_URL}/send-push-notification`, method: 'POST', body }),
      invalidatesTags: ['Push-Notification']
    })
  })
})

export const { useSendPushNotificationMutation } = pushNotificationApi
