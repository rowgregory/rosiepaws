import { PayloadAction, Reducer, createSlice } from '@reduxjs/toolkit'
import { pushNotificationApi } from '../services/pushNotificationApi'

export interface PushNotificationStatePayload {
  isNotificationPermissionGranted: boolean
  deviceToken: string
  subscription: SerializedSubscription | null | any
  success: boolean
}

type SubscriptionKeys = {
  p256dh: string
  auth: string
}

export type SerializedSubscription = {
  endpoint: string
  keys: SubscriptionKeys
}

const initialPushNotificationState: PushNotificationStatePayload = {
  isNotificationPermissionGranted: false,
  deviceToken: '',
  subscription: null,
  success: false
}

export const pushNotificationSlice = createSlice({
  name: 'pushNotification',
  initialState: initialPushNotificationState,
  reducers: {
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.isNotificationPermissionGranted = action.payload
    },
    setDeviceToken: (state, action: PayloadAction<string>) => {
      state.deviceToken = action.payload
    },
    setSubscription: (state, action) => {
      state.subscription = action.payload
    },
    clearPushState: (state) => {
      state.isNotificationPermissionGranted = false
      state.deviceToken = ''
      state.subscription = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(pushNotificationApi.endpoints.sendPushNotification.matchFulfilled, (state) => {
      state.success = true
    })
  }
})

export const pushNotificationReducer = pushNotificationSlice.reducer as Reducer<PushNotificationStatePayload>

export const { setPermissionGranted, setDeviceToken, setSubscription, clearPushState } = pushNotificationSlice.actions
